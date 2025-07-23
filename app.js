const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const ApiError = require('./utils/apiError.js');
const errorHandler = require('./middleware/error.middleware.js');
const authRouter = require('./routes/auth.router.js');
const productRouter = require('./routes/product.router.js');
const cartRouter = require('./routes/cart.router.js');



const app=express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth',authRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)


app.use((req,res,next)=>{
    next(new ApiError(404,'Route not found'))
})
app.use(errorHandler);


module.exports=app;

