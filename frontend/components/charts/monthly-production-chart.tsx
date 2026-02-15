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

import type { MonthlyProduction } from "@/types/api"

interface MonthlyProductionChartProps {
    data: MonthlyProduction[]
}

const chartConfig = {
    expected_gwh: {
        label: "Expected (GWh)",
        color: "var(--primary)",
    },
    actual_gwh: {
        label: "Actual (GWh)",
        color: "var(--color-chart-5)",
    },
} satisfies ChartConfig

export function MonthlyProductionChart({ data }: MonthlyProductionChartProps) {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Monthly Energy Production</CardTitle>
                <CardDescription>
                    Expected vs actual energy output by month (GWh)
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[280px] w-full"
                >
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent indicator="line" />
                            }
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="expected_gwh"
                            fill="var(--color-expected_gwh)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="actual_gwh"
                            fill="var(--color-actual_gwh)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
