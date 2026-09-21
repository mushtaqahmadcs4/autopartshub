'use client'

import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react'
import { setUserData } from '@/redux/userSlice'
import { AppDispatch } from '@/redux/store'

export default function InitUser() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const getMe = async () => {
      try {
        const result = await axios.get('/api/me')
        if (result.data) {
          // Store the fetched user inside Redux global state
          dispatch(setUserData(result.data.user || result.data))
        }
      } catch (error) {
        console.log('Error setting user state:', error)
      }
    }

    getMe()
  }, [dispatch])

  return null
}