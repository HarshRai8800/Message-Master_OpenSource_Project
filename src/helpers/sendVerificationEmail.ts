import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationEamil";
import ApiResponce from "@/types/ApiResponce";

interface  sendingVerificationEmail{
email:string,
username:string,
otp:string


}

export async function sendVerificationEmail({email,username,otp}:sendingVerificationEmail):Promise<ApiResponce>{
    console.log(username,email,otp)
try {
    
   
const res=  await  resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Verification Eamil',
        html: `<div>${otp}</div>`
      });
console.log(res)
    
return{
    success:true,
    message:"email verification suceesfull"
}
   
} catch (error) {
    console.error(error)
        return {
       success:false,
        message:"email verification failed",}
}



}