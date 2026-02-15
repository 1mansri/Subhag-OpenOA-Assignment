export interface HealthResponse {
    status: string;
    engine: string;
    library_installed: boolean;
}

export interface AnalysisRequest {
    plant_name: string;
}

export interface PowerCurvePoint {
    wind_speed: number;
    actual_power: number;
    ideal_power: number;
}

export interface MonthlyProduction {
    month: string;
    expected_gwh: number;
    actual_gwh: number;
}

export interface AEPDistributionBin {
    bin_start: number;
    bin_end: number;
    bin_label: string;
    count: number;
}

export interface TurbineComparison {
    turbine_id: string;
    capacity_factor: number;
    availability: number;
    annual_energy_mwh: number;
}

export interface ChartData {
    power_curve: PowerCurvePoint[];
    monthly_production: MonthlyProduction[];
    aep_distribution: AEPDistributionBin[];
    turbine_comparison: TurbineComparison[];
    summary: {
        total_turbines: number;
        rated_power_mw: number;
        avg_capacity_factor: number;
        avg_availability: number;
        plant_name: string;
        num_simulations: number;
    };
}

export interface AnalysisResponse {
    status: string;
    mode: "REAL_DATA" | "SIMULATION_FALLBACK";
    aep_gwh: number;
    uncertainty: string;
    plot_image: string;
    chart_data: ChartData;
    debug_note?: string;
}
