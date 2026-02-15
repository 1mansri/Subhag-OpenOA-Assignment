"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"

import type { TurbineComparison } from "@/types/api"

interface TurbineComparisonChartProps {
    data: TurbineComparison[]
}

const chartConfig = {
    capacity_factor: {
        label: "Capacity Factor",
        color: "var(--primary)",
    },
    availability: {
        label: "Availability",
        color: "var(--color-chart-2)",
    },
} satisfies ChartConfig

export function TurbineComparisonChart({ data }: TurbineComparisonChartProps) {
    // Convert to percentages for display
    const displayData = data.map((t) => ({
        ...t,
        capacity_factor: +(t.capacity_factor * 100).toFixed(1),
        availability: +(t.availability * 100).toFixed(1),
    }))

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Turbine Performance Comparison</CardTitle>
                <CardDescription>
                    Capacity factor and availability per turbine (%)
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[280px] w-full"
                >
                    <BarChart data={displayData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="turbine_id"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            domain={[0, 100]}
                            label={{ value: "%", angle: -90, position: "insideLeft" }}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="capacity_factor"
                            fill="var(--color-capacity_factor)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="availability"
                            fill="var(--color-availability)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
