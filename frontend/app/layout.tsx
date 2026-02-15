import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "OpenOA Cloud — AEP Analysis Dashboard",
  description:
    "Monte Carlo Annual Energy Production analysis powered by the OpenOA Python library. Analyze wind farm performance with real SCADA data.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <TooltipProvider>
          <SidebarProvider
            defaultOpen={true}
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
              } as React.CSSProperties
            }
          >
            <AppSidebar />
            <SidebarInset>
              <SiteHeader />
              <div className="flex flex-1 flex-col">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
