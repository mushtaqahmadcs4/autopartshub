'use client'

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Store, User, UserCog } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function EditroleandMobile() {
  const router = useRouter()
  const [role, setRole] = useState([
    { id: "admin", label: "Admin", Icon: UserCog },
    { id: "user", label: "User", Icon: User },
    { id: "vendor", label: "Vendor", Icon: Store }
  ])
  
  const [selectedRole, setSelectedRole] = useState("")
  const [mobile, setMobile] = useState("")
  const { update } = useSession()

  // Check if an admin exists when component mounts
  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const result = await axios.get("/api/check-for-admin")
        if (result.data?.adminExist) {
          // Filter out the admin option if one already exists
          setRole((prevRoles) => prevRoles.filter((item) => item.id !== "admin"))
        }
      } catch (error) {
        console.error("Error checking for admin status:", error)
      }
    }

    checkForAdmin()
  }, [])

  const handleEdit = async () => {
    try {
      const result = await axios.post("/api/user/editrole", {
        role: selectedRole,
        mobile
      })

      if (result.status === 200) {
        await update({ role: selectedRole })
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex flex-col items-center min-h-screen p-6 w-full bg-white'>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className='text-3xl md:text-4xl font-extrabold text-red-700 text-center mt-8'
      >
        Select Your Role
      </motion.h1>

      <div className='flex flex-col md:flex-row justify-center items-center gap-6 mt-6'>
        {role.map((item) => {
          const IconComponent = item.Icon
          const isSelected = selectedRole === item.id
          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedRole(item.id)}
              className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-red-600 bg-red-100 shadow-lg"
                  : "border-gray-300 bg-white hover:border-red-400"
              }`}
            >
              <IconComponent />
              <span>{item.label}</span>
            </motion.div>
          )
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className='flex flex-col items-center mt-10'
      >
        <label htmlFor="mobile" className='text-gray-700 font-medium mb-2'>
          Enter Your Mobile Number
        </label>
        <input 
          type="tel" 
          id="mobile" 
          className='w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none text-gray-800' 
          placeholder='+920000000000' 
          onChange={(e) => setMobile(e.target.value)}
        />
      </motion.div>

      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        disabled={mobile.length !== 11 || !selectedRole}
        className={`inline-flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 mt-20 ${
          selectedRole && mobile.length === 11
            ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            : "bg-gray-300 text-gray-50 cursor-not-allowed"
        }`}
        onClick={handleEdit}
      >
        Next
      </motion.button>
    </div>
  )
}

export default EditroleandMobile