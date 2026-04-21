'use client'

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import * as React from 'react'

import { theme } from '@/lib/mui/theme'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
