'use client'

import axios from 'axios'
import { useEffect } from 'react'

export default function InitUser() {
  useEffect(() => {
    const getMe = async () => {
      try {
        const result = await axios.get('/api/me')
        console.log('Logged in user data:', result.data)
      } catch (error) {
        console.log('Error fetching user data:', error)
      }
    }

    getMe()
  }, [])

  return null
}