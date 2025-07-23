const  cloudinary  = require("../config/cloudinary.js");
const sharp=require('sharp');
const fs = require('fs');
const Product = require("../db/models/product.js");
const catchAsync = require("../middleware/catchAsync.js");
const ApiError = require("../utils/apiError.js");

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, stock } = req.body;

  if (!name || !description || !price || !stock) {
    return next(new ApiError(400, 'Missing required product fields'));
  }

  if (!req.files || req.files.length === 0) {
    return next(new ApiError(400, 'Product images are required'));
  }

  const uploadedImages = [];

  try {
    for (const file of req.files) {
      const compressedPath = `uploads/compressed-${file.filename}`;

      await sharp(file.path)
        .resize(1024)
        .jpeg({ quality: 70 })
        .toFile(compressedPath);

      const result = await cloudinary.uploader.upload(compressedPath, {
        folder: 'products',
      });

      uploadedImages.push(result.secure_url);

      // Delete temp files
      await fs.promises.unlink(file.path);
      await fs.promises.unlink(compressedPath);

    }
  } catch (error) {
    console.error('Image upload error:', error);
    return next(new ApiError(500, 'Image upload failed'));
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    imageUrl: uploadedImages,
  });

  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created successfully',
  });
});


exports.getAllProducts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { count, rows: products } = await Product.findAndCountAll({
    offset,
    limit,
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    success: true,
    total: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    data: products,
  });
});



exports.getSingleProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});



exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  const product = await Product.findByPk(id);
  if (!product) return next(new ApiError(404, 'Product not found'));

  let uploadedImages = product.imageUrl;

  // If new images are uploaded, process them
  if (req.files && req.files.length > 0) {
    uploadedImages = [];

    for (const file of req.files) {
      const compressedPath = `uploads/compressed-${file.filename}`;

      await sharp(file.path)
        .resize(1024)
        .jpeg({ quality: 70 })
        .toFile(compressedPath);

      const result = await cloudinary.uploader.upload(compressedPath, {
        folder: 'products',
      });

      uploadedImages.push(result.secure_url);

      // Cleanup temp files
      await fs.promises.unlink(file.path);
      await fs.promises.unlink(compressedPath);
    }
  }

  // Update product
  await product.update({
    name,
    description,
    price,
    stock,
    imageUrl: uploadedImages,
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});



exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) return next(new ApiError(404, 'Product not found'));

  await product.destroy(); // If you are using `paranoid: true` in model for soft delete

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

