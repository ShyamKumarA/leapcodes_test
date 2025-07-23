const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware.js');
const { authorizeRoles } = require('../middleware/role.middleware.js');
const upload = require('../middleware/multer.middleware.js');
const { createProduct, updateProduct, getAllProducts, getSingleProduct, deleteProduct } = require('../controller/product.controller.js');
const productRouter = express.Router();



productRouter.post(
  '/',
  verifyToken,
  authorizeRoles('admin', 'superadmin'),
  upload.array('images', 5),
    createProduct
);
productRouter.put(
  '/:id',
  verifyToken,
  authorizeRoles('admin', 'superadmin'),
  upload.array('images', 5),
    updateProduct
);



productRouter.get('/',verifyToken,getAllProducts)
productRouter.get('/:id',verifyToken,getSingleProduct)


productRouter.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
    deleteProduct
);

module.exports = productRouter;