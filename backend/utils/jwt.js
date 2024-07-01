export const generateToken=(user,message,status,res)=>{
    const token=user.generateJsonWebToken();
    const cookieName = user.role==="Admin" ?"adminToken" :"patientToken";
    res.status(200).cookie(cookieName,token,{
        expires: new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
        httpOnly:true,
    }).json({
        success:true,
        message,
        user,
        token
    })
}