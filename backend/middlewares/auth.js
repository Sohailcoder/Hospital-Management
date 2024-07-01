import { User } from "../models/userSchema.js";
import { catchAsyncError } from "./catchSyncError.js"
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
export const isAdminAuthenticated=catchAsyncError(async(req,res,next)=>{
    console.log(req.cookies);
    console.log(req.cookies.adminToken);
    const token= req.cookies.adminToken;
    if(!token){
        return next( new ErrorHandler("Admin not authenticated"),400);
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded);
    if(req.user.role !="Admin"){
        return next( new ErrorHandler(`${req.user.role} is authorized for this user`),403);
    }
    next();
})
export const isPatienAuthenticated=catchAsyncError(async(req,res,next)=>{
    const token= req.cookies.patientToken;
    if(!token){
        return next( newErrorHandler("Admin not authenticated"),400);
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded);
    if(req.user.role !="Patient"){
        return next ( new sErrorHandler(`${req.user.role} is authorized for this user`),403);
    }
    next();
})