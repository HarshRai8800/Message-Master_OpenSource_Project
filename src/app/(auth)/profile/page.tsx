"use client"
import React, { use, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { Messages } from '@/models/User'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import axios, { AxiosError } from "axios"
import ApiResponce from '@/types/ApiResponce'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Switch } from '@radix-ui/react-switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCw } from 'lucide-react'
import MessageCards from '@/components/MessageCards'
import { Input } from '@/components/ui/input'

function Profile() {
    console.log("inside")
    const [messages, setMessages] = useState<Messages[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
   const [acceptmessages,setValue]= useState<any>(false)
    const { toast } = useToast()

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession()

    
    // const fetchAcceptMessage = useCallback(async () => {
    //     setIsSwitchLoading(true)
    //     try {
    //         const response = await axios.get<ApiResponce>("/api/accept-messages")
    //         console.log(response)
    //         setValue( response.data.isAccesptingMessages)
    //     } catch (error) {
    //         const axiosError = error as AxiosError<ApiResponce>
    //         toast({
    //             title: "error",
    //             description: axiosError.response?.data.message || "failed to fetch message settings",
    //             variant: "destructive"
    //         })
    //     } finally {
    //         setIsSwitchLoading(false)
    //     }
    // }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {

        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get<ApiResponce>("/api/get-messages")
            console.log(response)
            setMessages(response.data.messages || [])
            if (refresh) {
                toast({
                    title: "Refresh Messages",
                    description: "Showing latest messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponce>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch messages",
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false)
            setIsLoading(false)
        }

    }, [])

    useEffect(() => {
        fetchMessages()
    }, [session, setValue, fetchMessages])



 const handleSwitchCjamge = async () => {
        try {
          console.log(acceptmessages)
          const response =   await axios.post<ApiResponce>("/api/accept-messages",
                {
                    acceptmessages: !acceptmessages
                }
            )
            console.log(response.data.updatedUser.isAcceptingMessage)
            setValue( response.data.updatedUser.isAcceptingMessage)
            console.log(acceptmessages)
            toast({
                title: "Success",
                description:"Message accepting status is set : " + response.data.updatedUser.isAcceptingMessage,
                variant: "default"
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponce>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        }
    }

    if (!session || !session.user) {
        return <div className="text-center p-6 text-lg font-semibold">Dashboard is loading...</div>
    }

    const { username } = session?.user as User
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "URL Copied",
            description: "Profile URL has been copied to clipboard"
        })
        console.log("copied")
    }



    return (
        <div className="bg-gray-900 overflow-hidden text-white h-screen w-full p-6">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2"> Your Unique Link To Receive Messages</h2>
                <div className="mb-4">
                    <div className="flex items-center">
                        <input type="text"
                            value={profileUrl}
                            onChange={(e)=>(console.log("url changed"))}
                            className="input input-bordered w-full p-2 mr-2 bg-gray-700 text-white"
                        />
                        <Button className='bg-slate-600' onClick={copyToClipboard}>Copy</Button>
                    </div>
                </div>

                <div className="mb-4 flex justify-start">
                    
                    <span className="ml-2">
                        Accepting Messages: {acceptmessages ? 'On' : 'Off'}
                    </span>
                    <Input 
                    className='bg-black size-8 ml-4'
                     type='checkBox'
                     value={acceptmessages}
                     onClick={handleSwitchCjamge}
                     />
                </div>
                <Separator />
                <Button
                    className="mt-4"
                    variant={'outline'}
                    onClick={(e) => {
                        e.preventDefault()
                        fetchMessages()
                    }}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                </Button>
                <div className="mt-4  grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <MessageCards
                                key={index}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) : (
                        <p>No messages to display</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile

