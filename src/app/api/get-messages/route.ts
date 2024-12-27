import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request:Request ){
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
    console.log(session.user)
const userId = new mongoose.Types.ObjectId(user._id)
console.log(userId)
try {
 
const user= await UserModel.aggregate([
    {
      '$match': {
        '_id': userId
      }
    }, {
      '$unwind': {
        'path': '$message'
      }
    }, {
      '$sort': {
        'messages.createdAt': -1
      }
    }, {
      '$group': {
        '_id': '$_id', 
        'message': {
          '$push': '$message'
        }
      }
    }
  ])
console.log(user)
if( !user.length){
    return Response.json({
    success:false,
    messages:"error in aggreagting messages"
    },{status:401})
}
console.log(user[0].message)
return Response.json({
    success:true,
    messages:user[0].message
    },{status:200})
} catch (error) {
    return Response.json({
        success:false,
        messages:"error in getting all messages"
        },{
            status:500})
}


}