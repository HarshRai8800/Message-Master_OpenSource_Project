import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";



export async function POST(request:Request){

const {username} = await request.json()
try {
     await dbConnect()
    const response = await UserModel.findOne({username})
    if(!response){
    return Response.json({
        success:false,
        message:"user not found"
    },{status:200})
    }
    return Response.json({
        success:true,
        message:"user exists"
    },{status:200})
    
} catch (error) {
    console.log(error)
    return Response.json({
        success:false,
        message:"error occured while searching"
    },{status:500})
    }



}