import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";



export async function POST(request:Request) {
    await dbConnect()
try {
    const {username,code}=await request.json()
    const decodeduser = decodeURIComponent(username)
    const findUser = await UserModel.findOne({
        username:decodeduser
    })
    if(!findUser){
        return Response.json({
            success:false,
            message:"username not found in database"
           },{
            status:400
           })
    }
const isCodeValid = findUser.verifyCode ===code
const isCodeNotExpired = new Date(findUser.VerifyCodeExpiry)>new Date()

if(isCodeNotExpired&&isCodeValid){
    findUser.isVerified=true
    await findUser.save()
    return Response.json({
        success:false,
        message:"account verified successfully "
       },{
        status:200
       })}
    else if(!isCodeNotExpired){
        return Response.json({
            success:false,
            message:"error token given has been expired"
           },{
            status:400
           })
    }else{
        return Response.json({
            success:false,
            message:"something went wrong while verifying user"
           },{
            status:400
           })
    }


} catch (error) {
   console.log("erro while verifiying user")
   
   return Response.json({
    success:false,
    message:"error verifying user"
   },{
    status:500
   })


}


}