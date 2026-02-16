"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, Loader2 } from "lucide-react"

import type { AnalysisResponse, HealthResponse } from "@/types/api"
import { SectionCards } from "@/components/section-cards"
import { PowerCurveChart } from "@/components/charts/power-curve-chart"
import { MonthlyProductionChart } from "@/components/charts/monthly-production-chart"
import { AEPDistributionChart } from "@/components/charts/aep-distribution-chart"
import { TurbineComparisonChart } from "@/components/charts/turbine-comparison-chart"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000"

export function AnalysisDashboard() {
    const [data, setData] = useState<AnalysisResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    // Health check
    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch(API_BASE, { cache: "no-store" })
                if (!res.ok) throw new Error()
                const health: HealthResponse = await res.json()
                setIsConnected(health.library_installed)
            } catch {
                setIsConnected(false)
            }
        }

        check()
        const interval = setInterval(check, 30000)
        return () => clearInterval(interval)
    }, [])

    const runAnalysis = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plant_name: "La Haute Borne" }),
            })
            if (!res.ok) {
                throw new Error(`Server returned ${res.status}: ${res.statusText}`)
            }
            const result: AnalysisResponse = await res.json()
            setData(result)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to connect to the analysis engine. Is the Docker container running?"
            )
        } finally {
            setLoading(false)
        }
    }, [])

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards data={data} isConnected={isConnected} />

                {/* Control Bar */}
                <div className="flex items-center justify-between px-4 lg:px-6">
                    <div>
                        <h2 className="text-lg font-semibold">Analysis</h2>
                        <p className="text-muted-foreground text-sm">
                            Run Monte Carlo AEP simulation on the La Haute Borne dataset
                        </p>
                    </div>
                    <Button onClick={runAnalysis} disabled={loading} className="gap-2">
                        {loading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span className="hidden sm:inline">Running Simulations…</span>
                                <span className="sm:hidden">Running…</span>
                            </>
                        ) : (
                            <>
                                <Play className="size-4" />
                                <span>Run Analysis</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="px-4 lg:px-6">
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
                                <div className="relative">
                                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Running Monte Carlo Simulations</p>
                                    <p className="text-muted-foreground text-xs mt-1">
                                        50 iterations — this may take a moment…
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="px-4 lg:px-6">
                        <Card className="border-red-200 dark:border-red-800">
                            <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-red-800 dark:text-red-300">Backend Unavailable</p>
                                <p className="text-muted-foreground text-xs max-w-sm text-center">{error}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && !data && (
                    <div className="px-4 lg:px-6">
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
                                <div className="rounded-full bg-muted p-3">
                                    <Play className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium">No Analysis Results Yet</p>
                                <p className="text-muted-foreground text-xs max-w-sm text-center">
                                    Click &quot;Run Analysis&quot; to execute a Monte Carlo AEP simulation
                                    against the La Haute Borne wind farm dataset using the OpenOA engine.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Results — Tabbed Chart Views */}
                {data && !loading && (
                    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 px-4 lg:px-6">
                        <Tabs defaultValue="overview" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="power-curve">Power Curve</TabsTrigger>
                                <TabsTrigger value="production">Production</TabsTrigger>
                                <TabsTrigger value="turbines">Turbines</TabsTrigger>
                            </TabsList>

                            {/* Overview Tab — AEP Distribution + Plot Image */}
                            <TabsContent value="overview" className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                    {data.chart_data?.aep_distribution?.length > 0 && (
                                        <AEPDistributionChart
                                            data={data.chart_data.aep_distribution}
                                            meanAep={data.aep_gwh}
                                        />
                                    )}
                                    <Card className="@container/card">
                                        <CardHeader>
                                            <CardTitle>Backend Plot Output</CardTitle>
                                            <CardDescription>
                                                Matplotlib-rendered visualization from the OpenOA engine
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {data.plot_image && (
                                                <div className="overflow-hidden rounded-lg border">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={data.plot_image}
                                                        alt="OpenOA Analysis Plot"
                                                        className="h-auto w-full object-contain"
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                                {data.debug_note && (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs dark:border-amber-800 dark:bg-amber-950/20">
                                        <span className="font-medium text-amber-800 dark:text-amber-300">Note: </span>
                                        <span className="text-amber-700 dark:text-amber-400">{data.debug_note}</span>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Power Curve Tab */}
                            <TabsContent value="power-curve">
                                {data.chart_data?.power_curve?.length > 0 && (
                                    <PowerCurveChart data={data.chart_data.power_curve} />
                                )}
                            </TabsContent>

                            {/* Production Tab */}
                            <TabsContent value="production">
                                {data.chart_data?.monthly_production?.length > 0 && (
                                    <MonthlyProductionChart data={data.chart_data.monthly_production} />
                                )}
                            </TabsContent>

                            {/* Turbines Tab */}
                            <TabsContent value="turbines" className="space-y-4">
                                {data.chart_data?.turbine_comparison?.length > 0 && (
                                    <TurbineComparisonChart data={data.chart_data.turbine_comparison} />
                                )}
                                {/* Turbine Detail Table */}
                                {data.chart_data?.turbine_comparison?.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Turbine Details</CardTitle>
                                            <CardDescription>
                                                Individual turbine performance metrics
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b text-left">
                                                            <th className="pb-3 pr-4 font-medium text-muted-foreground">Turbine</th>
                                                            <th className="pb-3 pr-4 font-medium text-muted-foreground text-right">Capacity Factor</th>
                                                            <th className="pb-3 pr-4 font-medium text-muted-foreground text-right">Availability</th>
                                                            <th className="pb-3 font-medium text-muted-foreground text-right">Annual Energy (MWh)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.chart_data.turbine_comparison.map((t) => (
                                                            <tr key={t.turbine_id} className="border-b last:border-0">
                                                                <td className="py-3 pr-4 font-medium">{t.turbine_id}</td>
                                                                <td className="py-3 pr-4 text-right tabular-nums">
                                                                    {((t.capacity_factor ?? 0) * 100).toFixed(1)}%
                                                                </td>
                                                                <td className="py-3 pr-4 text-right tabular-nums">
                                                                    {((t.availability ?? 0) * 100).toFixed(1)}%
                                                                </td>
                                                                <td className="py-3 text-right tabular-nums font-medium">
                                                                    {(t.annual_energy_mwh ?? 0).toLocaleString()}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
    )
}
