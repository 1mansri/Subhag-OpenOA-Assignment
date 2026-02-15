"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"

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

import type { AEPDistributionBin } from "@/types/api"

interface AEPDistributionChartProps {
    data: AEPDistributionBin[]
    meanAep: number
}

const chartConfig = {
    count: {
        label: "Frequency",
        color: "var(--primary)",
    },
} satisfies ChartConfig

export function AEPDistributionChart({ data, meanAep }: AEPDistributionChartProps) {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>AEP Distribution — Monte Carlo</CardTitle>
                <CardDescription>
                    Histogram of 50-iteration AEP simulation results (GWh)
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
                            dataKey="bin_label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={11}
                            angle={-30}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            label={{ value: "Count", angle: -90, position: "insideLeft" }}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent />}
                        />
                        <ReferenceLine
                            x={data.find(
                                (d) => meanAep >= d.bin_start && meanAep < d.bin_end
                            )?.bin_label}
                            stroke="var(--color-chart-5)"
                            strokeDasharray="4 4"
                            strokeWidth={2}
                            label={{
                                value: `Mean: ${meanAep} GWh`,
                                position: "top",
                                fill: "var(--color-chart-5)",
                                fontSize: 12,
                            }}
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
