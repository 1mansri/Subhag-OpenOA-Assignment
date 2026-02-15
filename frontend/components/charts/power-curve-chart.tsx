"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Line,
    LineChart,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

import type { PowerCurvePoint } from "@/types/api"

interface PowerCurveChartProps {
    data: PowerCurvePoint[]
}

const chartConfig = {
    ideal_power: {
        label: "Ideal Power",
        color: "var(--primary)",
    },
    actual_power: {
        label: "Actual Power",
        color: "var(--color-chart-5)",
    },
} satisfies ChartConfig

export function PowerCurveChart({ data }: PowerCurveChartProps) {
    // Sample every 4th point for cleaner rendering
    const sampled = data.filter((_, i) => i % 4 === 0)

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Power Curve — Ideal vs Actual</CardTitle>
                <CardDescription>
                    Turbine power output comparison across wind speeds (m/s)
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[280px] w-full"
                >
                    <AreaChart data={sampled}>
                        <defs>
                            <linearGradient id="fillIdeal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-ideal_power)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--color-ideal_power)" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-actual_power)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--color-actual_power)" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="wind_speed"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            label={{ value: "Wind Speed (m/s)", position: "insideBottom", offset: -4 }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            label={{ value: "Power (kW)", angle: -90, position: "insideLeft" }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="ideal_power"
                            type="natural"
                            fill="url(#fillIdeal)"
                            stroke="var(--color-ideal_power)"
                            strokeWidth={2}
                        />
                        <Area
                            dataKey="actual_power"
                            type="natural"
                            fill="url(#fillActual)"
                            stroke="var(--color-actual_power)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
