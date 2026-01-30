'use client'

import React, { ReactNode } from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import CustomToaster from '@/components/CustomToaster'

interface RootLayoutProps {
    children: ReactNode;
}

const interFont = Inter({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <html lang="en" className={interFont.className}>
            <head>
                <link rel="icon" href="/favicon.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                <title>ProSuite</title>
            </head>
            <body className="antialiased overflow-hidden">
                {children}
                <CustomToaster />
            </body>

        </html>
    )
}

export default RootLayout
