import { auth } from '@/auth'
import AdminDashboard from '@/components/AdminDashboard'
import EditroleandMobile from '@/components/EditroleandMobile'
import NavBar from '@/components/NavBar'
import UserDashboard from '@/components/UserDashboard'
import VendorDashboard from '@/components/VendorDashboard'
import connectDb from '@/lib/db'
import User from '@/models/user.model'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Home() {
  await connectDb()
  const session = await auth()
  const user = await User.findById(session?.user?.id)
  
  if (!user) {
    redirect("/login")
  }

  const isIncomplete = !user.mobile || !user.role || (!user.mobile && user.role === "user")
  if (isIncomplete) {
    return <EditroleandMobile />
  }

  const plainUser = JSON.parse(JSON.stringify(user))

  return (
    <>
      <NavBar user={plainUser} />
      {user.role === "user" ? (
        <UserDashboard />
      ) : user.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <VendorDashboard />
      )}
    </>
  )
}