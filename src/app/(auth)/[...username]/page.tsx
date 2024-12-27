"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "next/navigation";
import { useChat, useCompletion } from "ai/react";
import { useToast } from "@/hooks/use-toast";

function Page() {
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [messageToSend, setMessageToSend] = useState("");
  const { toast } = useToast();
  const router = useParams();

  const {
    complete,
    completion,
    isLoading,
    error
  } = useCompletion({
    api: "/api/suggest-messages",
    body: {
      messages: [
        {
          role: "user",
          content: "Generate three engaging questions for anonymous messaging"
        }
      ]
    },
    onError: (err) => {
      console.error("Completion Error:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to generate suggestions",
        variant: "destructive",
      })
    }
  })

  const changeUsername = async () => {
    try {
      const response = await axios.post(`/api/check-username-registered`, {
        username: username,
      });
      console.log(response);
      if (response.data.success) {
        setUsernameAvailable(true);
      } else {
        setUsernameAvailable(false);
      }
    } catch (error) {
      setUsernameAvailable(false);
      console.error("Error checking username:", error);
    }
  };

  // Set the username to the first parameter from the router on mount
  // useEffect(() => {
  //   if (router && router[1]) {
  //     setUsername(router[1]?:" k "); // Assume router[0] contains the username'
  //   }
  // }, [router]);

  // Debounced username availability check
  useEffect(() => {
    if (!username) return;
    const timeout = setTimeout(changeUsername, 200);
    return () => clearTimeout(timeout);
  }, [username]);

  const handleSubmitMessages = async () => {
    try {
      const response = await axios.post("/api/send-messages", {
        username: username || "",
        content: messageToSend || "",
      });
      if (response.data.success) {
        toast({
          title: "Update on Message Delivery",
          description: `Message delivered successfully on ${new Date().toLocaleString()}`,
        });
        console.log(response.data);
      }else{
        toast({
           title: "Message could not be delivered",
           description:response.data.messages
        })
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSuggestMessages = async () => {
    try {
      await complete('', {
        body: {
          messages: [
            {
              role: "user",
              content: "Generate three engaging questions for anonymous messaging"
            }
          ]
        }
      })
    } catch (error) {
      console.error("Suggestion error:", error)
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <h1 className="text-4xl font-bold text-slate-700 mb-4">Public Profile Link</h1>
      <p className="text-xl text-slate-600 mb-6">Send anonymous messages to:</p>

      {/* Username Input */}
      <div className="flex flex-col items-center w-full max-w-lg mb-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className={`w-full p-3 rounded border ${
            usernameAvailable ? "border-green-500" : "border-red-500"
          } focus:outline-none focus:ring focus:ring-indigo-200`}
        />
        {usernameAvailable ? (
          <span className="text-sm text-green-500 mt-1">Username is available</span>
        ) : (
          <span className="text-sm text-red-500 mt-1">Username is not available</span>
        )}
      </div>

      {/* Textarea for Messages */}
      <div className="flex flex-col w-full max-w-lg mb-6">
        <Textarea
          placeholder="Enter your text to send here"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          className="w-full h-24 p-3 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>
      <Button onClick={handleSubmitMessages} className="w-24 h-12 mb-6 bg-green-500">
        Send Message
      </Button>

      {/* Suggest Messages Button */}
      <div className="mb-6">
        <Button
          onClick={handleSuggestMessages}
          disabled={isLoading}
          className={`px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Loading..." : "Suggest Messages"}
        </Button>
      </div>

      {/* Suggested Messages Section */}
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">
        Click on the messages to select one:
      </h2>
      <div className="w-full max-w-lg border shadow-md bg-white rounded p-4">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Messages:</h3>
        <div className="flex flex-col gap-2">
        {error && (
        <div className="w-full max-w-lg p-4 mb-6 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">
            {error instanceof Error ? error.message : "Failed to load suggestions. Please try again."}
          </p>
        </div>
      )}

      {completion && (
        <div className="w-full max-w-lg border shadow-md bg-white rounded p-4">
          <h3 className="text-lg font-bold text-slate-700 mb-4">Suggested Messages:</h3>
          <div className="flex flex-col gap-2">
            {completion.split("||").map((message, index) => (
              <button
                key={index}
                onClick={() => setMessageToSend(message.trim())}
                className="p-2 text-left bg-gray-100 rounded hover:bg-indigo-100 transition-colors"
              >
                {message.trim()}
              </button>
            ))}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default Page;
