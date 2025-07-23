const express=require('express');
const { verifyToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const { getAllUsers } = require('../controller/user.controller');


const userRouter=express.Router();


userRouter.get('/',verifyToken,authorizeRoles("superadmin","admin"),getAllUsers)


module.exports=userRouter;