"use client"
import React from 'react'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import message from "@/message.json"

function Home() {
  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen p-6 flex flex-col items-center justify-center">
      <section className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-50">Dive into the World of Anonymous Conversations</h1>
        <p className="text-lg text-gray-400 mt-2">Explore Mystery Message - where your identity remains a secret</p>
      </section>

      <Carousel 
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {message.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-2">
                <Card className="bg-gray-800 shadow-lg border border-gray-700 rounded-lg">
                  <CardHeader className="text-base font-medium text-gray-100">
                    {message.title}
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-4 h-40">
                    <span className="text-base font-semibold text-gray-200 text-center">
                      {message.content}
                    </span>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-400">
                    {message.received}
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 transform -translate-y-1/2 top-1/2 p-2 bg-gray-700 rounded-full shadow-md hover:bg-gray-600" />
        <CarouselNext className="absolute right-0 transform -translate-y-1/2 top-1/2 p-2 bg-gray-700 rounded-full shadow-md hover:bg-gray-600" />
      </Carousel>
    </main>
  )
}

export default Home


