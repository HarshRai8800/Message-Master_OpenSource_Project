import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { string } from "zod";


export async function POST(request:Request){
  const data =await request.json();

    console.log(data)
await dbConnect()


if(!data?.user){
    return Response.json({
        sucess:false,
        message:"Not Authenticated"
    },{
        status:401
    })
}
try {
    const response = await UserModel.updateOne({
        username:data?.user
    },{
        $pull:{message:{_id:data?.messageId
        }}
    })
   console.log(response.modifiedCount)
    if(response.modifiedCount==0){
        return Response.json({
            sucess:false,
            message:"Message not found or already deleted"
        },{
            status:401
        })
    }
    return Response.json({
        sucess:true,
        message:"Message deleted successfully"
    },{
        status:200
    })

} catch (error) {
    console.log("Error in deleting messages : "+ error)
     return Response.json({
        sucess:false,
        message:"Error in deleteing message "
    },{
        status:500
    })
}

}