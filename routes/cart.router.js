const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware.js');
const { addToCart, viewCart, updateCartItem, removeCartItem } = require('../controller/cart.controller.js');


const cartRouter=express.Router();

cartRouter.post('/',verifyToken,addToCart);
cartRouter.get('/',verifyToken,viewCart);
cartRouter.put('/',verifyToken,updateCartItem);
cartRouter.delete('/',verifyToken,removeCartItem);




module.exports=cartRouter;