"use client"
import React from 'react'
import { verifySchema } from '@/schemas/verifySchema'
import { useParams ,useRouter} from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useForm} from "react-hook-form"
import z from "zod"

import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import ApiResponce from '@/types/ApiResponce'
import { FormControl, FormDescription, FormField,Form, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'



const VerifyAccount=()=>{
    const router = useRouter()
    const {toast} = useToast()
    const params = useParams()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

const onSubmit = async(data:z.infer<typeof verifySchema>)=>{
console.log(params)
try {
  const response=  await axios.post("/api/verify-code",{
        username:params.username,
        code:data.code
    })
    console.log(response)
    toast({
        title:"Success",
        description:response.data.message
    })
    router.replace("/sign-in")
} catch (error) {
    console.error("Error in signup of user",error)
    const axiosError=error as AxiosError<ApiResponce>;
    let errorMessage = axiosError.response?.data.message
    toast({
        title:"Signup failed",
        description:errorMessage,
        variant:"destructive"
    })
    
}



}

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
<div className="w-full max-w-md p-8  text-center text-4xl font-bold space-y-8 bg-white rounded-lg shadow-md">
  VERIFY YOUR ACCOUNT
<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input type='text' placeholder="code" {...field} />
              </FormControl>
              <FormDescription>
               Enter the verificatiion code 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> 
        <Button type='submit'>
          verify
        </Button>
      </form>
    </Form>



</div>


    </div>
  )
}

export default VerifyAccount