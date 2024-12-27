"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'

import { Button } from './ui/button'

export default function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="p-4 md:p-6 shadow-md bg-black text-white">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Brand Name */}
        <a className="text-xl font-bold text-gray-200 hover:text-gray-400" href="#">
          Message Master
        </a>

        {/* Center: Username */}
        {session && (
          <span className="text-gray-300 text-lg mx-auto">
            Welcome, {user.username || user.email}
          </span>
        )}

        {/* Right: Links and Buttons */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link href={`/`}>
                <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                  Home Page
                </Button>
              </Link>
              <Link href="/profile">
                <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                  Profile
                </Button>
              </Link>
              <Link href={`/u/${user.username}`}>
                <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                  Send Messages
                </Button>
              </Link>
              <Button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

