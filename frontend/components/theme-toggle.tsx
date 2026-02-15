"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const [isDark, setIsDark] = React.useState(false)

    React.useEffect(() => {
        // Check if there's a saved preference or system preference
        const saved = localStorage.getItem("theme")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        const shouldBeDark = saved === "dark" || (!saved && prefersDark)
        setIsDark(shouldBeDark)
        document.documentElement.classList.toggle("dark", shouldBeDark)
    }, [])

    const toggleTheme = () => {
        const next = !isDark
        setIsDark(next)
        document.documentElement.classList.toggle("dark", next)
        localStorage.setItem("theme", next ? "dark" : "light")
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
        >
            {isDark ? (
                <Sun className="size-4" />
            ) : (
                <Moon className="size-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
