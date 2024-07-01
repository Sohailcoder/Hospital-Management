import { catchAsyncError } from "../middlewares/catchSyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {generateToken} from '../utils/jwt.js'
import cloudinary from "cloudinary";
export const patientRegister=catchAsyncError(async(req,res,next)=>{
    const {firstName,lastName,email,phone,role,dob,nic,gender,password}=req.body;

    if(!firstName||!lastName||!email||!phone||!role||!dob||!nic||!gender||!password) 
        return next( new ErrorHandler("fill all the form" ,400))

    let user = await User.findOne({email});

    if(user){
        return next( new ErrorHandler("User already registered" ,400))
    }
     
    user = await User.create({
        firstName,lastName,password,email,phone,role,dob,nic,gender,
    });
    generateToken(user,"Patient registered succesfully",200,res);
})

export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password,confirmPassword,role}= req.body;
    if(!email||!password||!confirmPassword){
        return next(new ErrorHandler("fill required",400))
    }
    if(password!==confirmPassword){
        return next(new ErrorHandler("Password not match",400));
    }
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid password or email"),400)
    }
    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched)
        {
        return next(new ErrorHandler("Invalid password or email"),400) 
    }
    if(role!==user.role){
        return next(new ErrorHandler("User with role not found"),400)
    }
    generateToken(user,"User login succesfully",200,res);


});

export const addNewAdmin = catchAsyncError(async (req, res,next) => { // <-- Next is not defined here
    const { firstName, lastName, email, phone, dob, nic, gender, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !dob || !nic || !gender || !password) {
        return next(new ErrorHandler("Fill all required details"), 400); // <-- Next should be an argument here
    }

    let isRegistered = await User.findOne({ email });

    if (isRegistered) {
        return next(new ErrorHandler("Admin already registered"), 400); // <-- Next should be an argument here
    }
    
    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        nic,
        gender,
        password,
        role: "Admin"  
    });

    res.status(200).json({
        message: "Admin registered",
        success: true
    });
});

export const getallDoctor =catchAsyncError (async(req,res,next)=>{
    const doctors= await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors,
    })
})

export const getUserDetails= catchAsyncError(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user,
    }); 
})

export const adminLogout= catchAsyncError(async (req,res,next)=>{
    res.status(200)
    .cookie("adminToken","",{
        httpOnly:true,
        expires: new Date(Date.now())
    }).json({
        message:"Logout Successfully",
        success:true
    })
})
export const patientLogout= catchAsyncError(async (req,res,next)=>{
    res.status(200)
    .cookie("patientToken","",{
        httpOnly:true,
        expires: new Date(Date.now())
    }).json({
        message:"Logout Successfully",
        success:true
    })
})

export const addNewDoctor=catchAsyncError(async( req,res,next)=>{
    if(!req.files|| Object.keys(req.files).length==0){
        return next( new ErrorHandler("Docter Avatar required",400))
    }
    const {docAvatar}=req.files;
    const allowedformats=["image/png",'image/jpeg','image/webp'];
    if(!allowedformats.includes(docAvatar.mimetype)){
        return next( new ErrorHandler("File type not supported",400));
    };

    const {
        firstName,
        lastName,
        email,
        phone,
        dob,
        nic,
        gender,
        password,
        doctorDepartment,
    }=req.body
    if(
        !firstName||
        !lastName||
        !email||
        !phone||
        !dob||
        !nic||
        !gender||
        !password||
        !doctorDepartment
    ){
        return next( new ErrorHandler("All fields are required",400));
    }
    const isRegistered= await User.findOne({email});
    if(isRegistered){
        return next( new ErrorHandler(`${isRegistered.role} already registere`,400));
    }
    const cloudinaryResponse= await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    )
    if(!cloudinaryResponse){
        console.log("Cloudinay error:",cloudinaryResponse.error || "Unknown error");

    }
    const doctor= await User.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        nic,
        gender,
        password,
        doctorDepartment,
        role:"Doctor",
        docAvatar:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        }

    });
    res.status(200).json({
        succes:true,
        message:"New Docter Registered",
        doctor,
    })
})
