'use client'
import { EyeIcon, EyeOff, Loader2, Lock, LogIn, Mail, Wrench } from 'lucide-react'
import React, { FormEvent, useState } from 'react'
import { motion } from "framer-motion"
import googlelogo from "@/assets/googlelogo.png"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, showSetPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const session = useSession()
  console.log(session)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      })
      router.push("/")
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>
      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className='text-4xl font-extrabold text-red-700 mb-2'
      >
        Welcome Back
      </motion.h1>
      <p className='text-gray-600 mb-8 flex items-center gap-1'>
        Login To AutoPartsHub <Wrench className='w-5 h-5 text-red-600' />
      </p>

      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className='flex flex-col gap-5 w-full max-w-sm'
      >
        {/* Email Input */}
        <div className='relative'>
          <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
          <input
            type='email'
            placeholder='Enter Your Email'
            className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-red-500 focus:outline-none'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Password Input */}
        <div className='relative'>
          <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Enter Your Password'
            className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-red-500 focus:outline-none'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {showPassword ? (
            <EyeOff
              className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer'
              onClick={() => showSetPassword(false)}
            />
          ) : (
            <EyeIcon
              className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer'
              onClick={() => showSetPassword(true)}
            />
          )}
        </div>

        {/* Form Submit Button */}
        {(() => {
          const formValidation = email !== "" && password !== ""
          return (
            <button
              type="submit"
              disabled={!formValidation || loading}
              className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
                formValidation
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : "Login"}
            </button>
          )
        })()}

        <div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
          <span className='flex-1 h-px bg-gray-200'></span>
          OR
          <span className='flex-1 h-px bg-gray-200'></span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          className='w-full flex items-center justify-center gap-3 border border-gray-400 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200'
          onClick={() => signIn('google', { callbackUrl: "/" })}
        >
          <Image src={googlelogo} width={20} height={20} alt='google' />
          Continue with Google
        </button>
      </motion.form>

      <p
        className='cursor-pointer text-gray-600 mt-6 text-sm flex items-center gap-1'
        onClick={() => router.push("/register")}
      >
        Want to create an account?
        <LogIn className='w-4 h-4' />
        <span className='text-red-600'>Sign up</span>
      </p>
    </div>
  )
}

export default Login