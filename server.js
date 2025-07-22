require('dotenv').config({path:`${process.cwd()}/.env`});

const express =require('express');

const app=express();


app.get('/',(req,res)=>{
    res.status(200).json({status:"success",msg:"Rest api are working"});
})

const PORT=process.env.PORT || 6060;

app.listen(PORT,()=>{
    console.log("server is running on",PORT);
})