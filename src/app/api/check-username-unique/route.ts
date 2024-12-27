import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {z} from "zod"
import {signupSchema} from "@/schemas/signUpSchema"

const UsernameQuerySchema = z.object({
    username:signupSchema
})

export async function GET(request:Request){
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        console.log(searchParams)
        const queryParam = {
            username:searchParams.get("username")
        }
        console.log(queryParam)
    const result = signupSchema.safeParse(queryParam)
    console.log(result)
    if(!result.success){
  const usernameErrors = result.error.format().username?._errors||[]
  return Response.json({
    success : false,
    message:usernameErrors?.length>0?usernameErrors.join(","):
    "invalid querey parameters",
  },{status:400})
}
  const {username} = result.data
const existingVerified = await UserModel.findOne({username,isVerified:true})
if(existingVerified){
    return Response.json({
        success : true,
        message:"username is already taken"
      },{status:400})
}
return Response.json({
    success : true,
    message:"username is unique"
  },{status:200})
    
    } catch (error) {
        console.log("error has occured while checking" + error)
        return Response.json({
            success:false,
            message:"erro while checking username"
        })
    }
}
