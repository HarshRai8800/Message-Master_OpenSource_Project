 import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
 import becrypt from "bcryptjs"


 export async function POST(request:Request){
await dbConnect()
try {
const {username,email,password}=await request.json()
const verifyCode = String( Math.floor((Math.random()+100)*90))
const isUserVerifiedAndRegistered=await UserModel.findOne({
    username,
    isVerified:false
})
console.log(isUserVerifiedAndRegistered)
if(isUserVerifiedAndRegistered){

return    Response.json({
success:false,
message:"user already exists and kindly verify your email"
},{status:500})
}

const isUserExistEmail = await UserModel.findOne({
    email,
    isVerified:true
})
console.log(isUserExistEmail)
if(isUserExistEmail){
if(isUserExistEmail.isVerified){
   return Response.json({
    success:false,
    message:`user has already been verified and exists`
    },{
        status:400
    })

}
else
{
const hashedPassword = await becrypt.hash(password,10)
isUserExistEmail.password=hashedPassword
isUserExistEmail.VerifyCodeExpiry=new Date(Date.now()+3600000)
await isUserExistEmail.save()
}}
else
{
const hashedPassword = await becrypt.hash(password,10)
const VerifyCodeExpiry= new Date()
VerifyCodeExpiry.setHours(VerifyCodeExpiry.getHours()+1)
const UserCreated = await UserModel.create({
    username,
    email,
    password:hashedPassword,
    verifyCode,
    VerifyCodeExpiry,
    isVerified:false,
    isAcceptingMessage:false,
    message:[]

})

await UserCreated.save()
}
const ResponceAfterEamil = await sendVerificationEmail({email,username,otp:String(verifyCode)})
console.log(ResponceAfterEamil)
if(!ResponceAfterEamil.success){
return Response.json({
success:false,
message:"error ha soccured while sending an email"+ResponceAfterEamil.message
},{
    status:500
})
}
return Response.json({
    success:true,
    message:`user ah registered sucessfully, kindly verify your email`
    },{
        status:200
    })

} catch (error) {
    console.log("error in registered user"+error)

  return  Response.json({
    success:false,
    message:"data cannot be posted "
  },{
    status:500
  })




}


}
