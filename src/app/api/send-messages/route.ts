import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Messages } from "@/models/User";


export async function POST(request:Request){
    await dbConnect()
    const {username,content}= await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!username || !user?.isAcceptingMessage){
            console.log("hi")
            return Response.json({
                success:false,
                messages:"user is not Accepting Message Right now or it dosent exist" 
                },{status:200})
        }
        const newMessage = {content,createdAt:new Date()}
          user?.message.push(newMessage as Messages)
         await user?.save()
         return Response.json({
            success:true,
            messages:user?.message[0]
            },{status:200})



    } catch (error) {
        
        console.log("error in sending message : " + error)
        return Response.json({
            success:false,
            messages:"error in sending  messages" + error
            },{status:500})
    }
}