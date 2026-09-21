'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/redux/store'

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <ReduxProvider store={store}>
        {children}
      </ReduxProvider>
    </SessionProvider>
  )
}

export default Provider