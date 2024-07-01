import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone Number Must Contain Exact 11 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 11 Digits!"],
  },
  role: {
    type: String,
    required: true,
    Enum: ["Admin","Doctor","Patient"],
  },
  dob:{
    type: Date,
    required:true,
    
  },
  doctorDepartment:{
    type: String,
    
  },
  docAvatar:
  {
    public_id:String,
    url: String,
  },
  nic:{
    type:Number,
    minLength:[5,"Enter the nic number"],
  },
  gender:{
    type:String,
    Enum:["male","female"],
  },
  password:{
    type:String,
    required:true,
    select:false,

  },

});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password= await bcrypt.hash(this.password,10);
});

userSchema.methods.generateJsonWebToken= function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPRIES});
}
userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

export const User = mongoose.model("User", userSchema);