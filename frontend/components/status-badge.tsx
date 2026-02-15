"use client"

import React, { useEffect, useState } from "react"
import type { HealthResponse } from "@/types/api"

type ConnectionStatus = "connecting" | "connected" | "disconnected"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function StatusBadge() {
    const [status, setStatus] = useState<ConnectionStatus>("connecting")

    useEffect(() => {
        let interval: NodeJS.Timeout

        const check = async () => {
            try {
                const res = await fetch(API_BASE, { cache: "no-store" })
                if (!res.ok) throw new Error("Not OK")
                const data: HealthResponse = await res.json()
                setStatus(data.library_installed ? "connected" : "disconnected")
            } catch {
                setStatus("disconnected")
            }
        }

        check()
        interval = setInterval(check, 30000)
        return () => clearInterval(interval)
    }, [])

    const config = {
        connecting: {
            color: "bg-yellow-500",
            ping: "bg-yellow-400",
            text: "Connecting…",
        },
        connected: {
            color: "bg-emerald-500",
            ping: "bg-emerald-400",
            text: "Engine Connected",
        },
        disconnected: {
            color: "bg-red-500",
            ping: "bg-red-400",
            text: "Disconnected",
        },
    }

    const { color, ping, text } = config[status]

    return (
        <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium">
            <span className="relative flex h-2.5 w-2.5">
                {status === "connecting" && (
                    <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full ${ping} opacity-75`}
                    />
                )}
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`} />
            </span>
            {text}
        </div>
    )
}
