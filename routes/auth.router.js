const express=require('express');
const { verifyToken } = require('../middleware/auth.middleware.js');
const { signin, createAdmin } = require('../controller/auth.controller.js');
const { authorizeRoles } = require('../middleware/role.middleware.js');

const authRouter=express.Router();


authRouter.post('/create-admin',verifyToken,authorizeRoles("superadmin"),createAdmin)
authRouter.post('/signin',signin)


module.exports=authRouter;