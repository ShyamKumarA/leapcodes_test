const Cart = require("../db/models/cart.js");
const CartItem = require("../db/models/cart_item.js");
const Product = require("../db/models/product.js");
const catchAsync = require("../middleware/catchAsync.js");
const ApiError = require("../utils/apiError.js");

exports.addToCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }

  let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });

  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({ cartId: cart.id, productId, quantity });
  }

  res.status(200).json({ success: true, message: 'Item added to cart' });
});


exports.updateCartItem = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) return next(new ApiError(404, 'Cart not found'));

  const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (!cartItem) return next(new ApiError(404, 'Item not found in cart'));

  cartItem.quantity = quantity;
  await cartItem.save();

  res.status(200).json({ success: true, message: 'Cart updated' });
});



exports.viewCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({
  where: { userId },
  include: [
    {
      model: CartItem,
      as: 'cart_items',
      include: [
        {
          model: Product,
          as: 'product'
        }
      ]
    }
  ]
});


  if (!cart) return res.status(200).json({ cartItems: [] });

  res.status(200).json({
    success: true,
    cartItems: cart.cart_items,
  });
});


exports.removeCartItem = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.body;

  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) return next(new ApiError(404, 'Cart not found'));

  await CartItem.destroy({ where: { cartId: cart.id, productId } });

  res.status(200).json({ success: true, message: 'Item removed from cart' });
});
