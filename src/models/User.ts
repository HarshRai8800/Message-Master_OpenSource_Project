import exp from "constants"
import mongoose, {Mongoose,Schema,Document} from "mongoose"
import { unique } from "next/dist/build/utils"
import { ST } from "next/dist/shared/lib/utils"
import { Message } from "postcss"
import { scheduler } from "timers/promises"
import { string } from "zod"


export interface Messages extends Document{
    content:string,
    createdAt:Date
}

const MessageScehma:Schema<Messages> = new Schema({
    content:{
        type:String,
        required:[true,"message is required"],
    },
    createdAt:{
        type:Date,
        require:[true,"date of creation is required"],
        default:Date.now
    }
})


export  interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:String,
    VerifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessage:boolean,
    message:Messages[]
}




const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"valid email is required"   ]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
     verifyCode:{
        type:String,
        required:[true,"verify code is required"]
     },
     VerifyCodeExpiry:{
        type:Date,
        required:[true,"verifyexpiry code is required"]
     },
     isVerified:{
    type:Boolean,
    default:true
     },
     isAcceptingMessage:{
        type:Boolean,
        default:true
     },
     message:[MessageScehma]
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)


export default UserModel