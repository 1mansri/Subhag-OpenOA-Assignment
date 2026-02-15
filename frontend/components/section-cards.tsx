"use client"

import { TrendingUp, TrendingDown, Activity, Zap, Wind, Gauge } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import type { AnalysisResponse } from "@/types/api"

interface SectionCardsProps {
    data: AnalysisResponse | null
    isConnected: boolean
}

export function SectionCards({ data, isConnected }: SectionCardsProps) {
    const summary = data?.chart_data?.summary

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {/* AEP Card */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Annual Energy Production</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {data ? `${data.aep_gwh} GWh` : "--.- GWh"}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <Zap className="size-3" />
                            AEP
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {data ? (
                            <>Monte Carlo estimate <TrendingUp className="size-4" /></>
                        ) : (
                            "Awaiting analysis"
                        )}
                    </div>
                    <div className="text-muted-foreground">
                        {summary ? `${summary.plant_name} · ${summary.num_simulations} iterations` : "La Haute Borne wind farm"}
                    </div>
                </CardFooter>
            </Card>

            {/* Uncertainty Card */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Uncertainty</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {data ? data.uncertainty : "--.--%"}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <Activity className="size-3" />
                            ±σ
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {data ? (
                            <>Within expected range <TrendingDown className="size-4" /></>
                        ) : (
                            "Awaiting analysis"
                        )}
                    </div>
                    <div className="text-muted-foreground">
                        Simulation spread across iterations
                    </div>
                </CardFooter>
            </Card>

            {/* Capacity Factor Card */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Avg. Capacity Factor</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {summary ? `${(summary.avg_capacity_factor * 100).toFixed(1)}%` : "--.-%"}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <Gauge className="size-3" />
                            CF
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {summary ? (
                            <>Across {summary.total_turbines} turbines <TrendingUp className="size-4" /></>
                        ) : (
                            "Awaiting analysis"
                        )}
                    </div>
                    <div className="text-muted-foreground">
                        {summary ? `Rated: ${summary.rated_power_mw} MW per turbine` : "Plant-wide metric"}
                    </div>
                </CardFooter>
            </Card>

            {/* Engine Status Card */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Engine Status</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {isConnected ? "Online" : "Offline"}
                    </CardTitle>
                    <CardAction>
                        <Badge
                            variant="outline"
                            className={
                                isConnected
                                    ? "text-emerald-600 border-emerald-200"
                                    : "text-red-600 border-red-200"
                            }
                        >
                            <span
                                className={`inline-block h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500"
                                    }`}
                            />
                            {isConnected ? "Healthy" : "Down"}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {isConnected ? (
                            <>
                                Backend active <Wind className="size-4" />
                            </>
                        ) : (
                            "Cannot reach backend"
                        )}
                    </div>
                    <div className="text-muted-foreground">
                        {data?.mode === "REAL_DATA"
                            ? "OpenOA real data mode"
                            : data?.mode === "SIMULATION_FALLBACK"
                                ? "Simulation fallback mode"
                                : "FastAPI + Docker"}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
