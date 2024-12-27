"use client"
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
  import {Messages, User} from "@/models/User"
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import ApiResponce from '@/types/ApiResponce'
import { useSession } from 'next-auth/react'
type messageCardProps={
    message:Messages;
    onMessageDelete:(messageId:any)=>void
}

function MessageCards({message,onMessageDelete}:messageCardProps) {
  const { data: session } = useSession()
const user: User = session?.user as User
const {toast} = useToast()
const handleDeleteConfirm=async()=>{
  console.log("in")
const response=await axios.post<ApiResponce>(`/api/delete-messages`,{
  messageId:message._id,
 user:user.username
})
console.log(response)
    toast({
       title:(await response).data.message
    })
    onMessageDelete(message._id)
}
  return ( 
    <Card >
    <CardHeader>
      <div className='flex justify-between'>
      <CardTitle>Card Title</CardTitle>
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='w-14' variant={"destructive"} ><X className='size-5'></X></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </div>
      
      <CardDescription>This Message Was Sent at {``+message.createdAt}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{message.content}</p>
    </CardContent>
    <CardFooter>
      
    </CardFooter>
  </Card>
  
  )
}

export default MessageCards