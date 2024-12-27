"use client";

import React, {  useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      
      email: "",
      password: "",
    },
  });

  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log(data)
    setIsSubmitting(true)
 const result =    await signIn("Sign-in",{
        redirect:true,
        email:data.email,
        password:data.password,
        callbackUrl:"/"       
    })

console.log(result)
    if(result?.error){
        if(result?.error=="CredentialsSignin"){
            setIsSubmitting(false)
            toast({
                title:"Login Failed",
                description:"Incorrect username or password",
                variant:"destructive"
            })
        }else{
            setIsSubmitting(false)
            toast({
                title:"Error",
                description:result.error,
                variant:"destructive"
            })


        }
      
    }
    setIsSubmitting(false)
    console.log(result)
    if(result?.url){
        router.replace("/dashboard")
    }
    }
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
     
      <div className="w-full max-w-md p-8  text-center text-4xl font-bold space-y-8 bg-white rounded-lg shadow-md">
      JOIN MESSSAGE MASTER      
        <div className="text-center text-xl  font-semibold">
        Signin to start your anonymous adventure
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
            
              <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign up"}
               </Button>
            </form>
          </FormProvider>

          <div className="text-center mt-4">
            <p>
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


