import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request:Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if(!session||!user){
        return Response.json({
            success:false,
            message:"not authorize"
        },{
            status:401
        })
    }
const userId = user?._id;
const {acceptmessages} = await request.json()

try {
console.log(acceptmessages)
const updatedUser = await UserModel.findByIdAndUpdate(userId,{
isAcceptingMessage:acceptmessages
},
{new:true})
if(!updatedUser){
    return Response.json({
        success:false,
        messages:"updated user message failed "
    },{status:401})
}
return Response.json({
    success:true,
    messages:"User status has been updated",
    updatedUser
},{status:200})    


} catch (error) {
    console.log("failed to update user status to accept messages : "+error)

    return Response.json({
        success:true,
        messages:"failed to update user status to accept messages"
    })
}

}

export async function GET(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if(!session||!user){
        return Response.json({
            success:false,
            message:"not authorize"
        },{
            status:401
        })
    }
const userId = user?._id;
    try {
        const foundUser = await UserModel.findById(userId)
if(!foundUser){
    return Response.json({
        success:false,
        messages:"failed to find user"
    })
}
return Response.json({
    success:true,
    message:foundUser.isAcceptingMessage
})

    } catch (error) {
        console.log("error in getting message aceptnce status : "+error)

        return Response.json({
            success:true,
            messages:"failed to get user status current accepting messages"
        })
}
}