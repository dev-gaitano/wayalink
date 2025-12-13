import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "WayaLink - Logistics Dashboard",
  description: "Real-time logistics tracking and fleet management dashboard",
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/diwkfbsgv/image/upload/v1762926951/favicon_qzkvnv.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "https://res.cloudinary.com/diwkfbsgv/image/upload/v1762926951/favicon_qzkvnv.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
