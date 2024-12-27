import { NextAuthOptions } from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import dbConnect from "@/lib/dbConnect"
import bcrypt from "bcryptjs"
import UserModel from "@/models/User"


export const authOptions:NextAuthOptions={
    providers: [
        CredentialsProvider({ 
          id:"Sign-in",
          name: "Sign-in",
          credentials: {
            email: { label: "email", type: "email", placeholder: "email" },
            password: { label: "password", type: "password" }
          },
          async authorize(credentials:any, req):Promise<any> {
          await dbConnect()
           try {
            console.log(credentials)
          const user =  await UserModel.findOne({
                $or:[
                    {email:credentials.email},
                    {password:credentials.password}
                ]
            })
          if(!user){
            throw new Error("The credentials entered are not correct or the user is not registered")
          }
          if(!user.isVerified){
            throw new Error ("The user is not verified please verify before login")
          }
          console.log(user.password+" "+ credentials.password)
        const verified =  await bcrypt.compare(credentials.password,user.password)
           if(verified){
            console.log(verified)
            return user
           }else{
            throw new Error("Incorrect passsword")
           }
           
    } catch (error:any) {
      console.log(error)
            throw new Error(error)
           }
          }
        })
      ],
      callbacks:{    
    async session({ session, token }) {
      if(token){
        session.user._id=token._id?.toString();
         session.user.isVerfied=token.isVerfied;
         session.user.isAcceptingMessages=token.isAcceptingMessages;
         session.user.username=token.username
      }
      return session
    },
    async jwt({ token, user }) {
      if(user){
        token._id=user._id?.toString(),
        token.isVerified=user.isVerfied;
        token.isAcceptingMessages=user.isAcceptingMessages;
        token.username=user.username
      }
      return token
    },
   async redirect({url,baseUrl}):Promise<string>{
    return `${url}`
   }
 
  
    
    
    },
      pages:{
      signIn:"/sign-in",
      signOut:"sign-out"
      },
      session:{
        strategy:"jwt"
      },
      
      
      secret:process.env.NEXT_AUTH_KEY

} 