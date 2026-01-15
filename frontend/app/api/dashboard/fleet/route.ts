import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  // Fetch data from API
  const req = await fetch(
    "https://wayalink-api.onrender.com/api/dashboard/fleet_management",
    { cache: "no-store" }
  )

  // Store data in a variable as JSON
  const fleet_management_data = await req.json()

  const totalUnits = Number(fleet_management_data.total_units)
  const activeUnits = Number(fleet_management_data.total_active_units)
  const maintenanceUnits = Number(fleet_management_data.total_under_maintenance)
  const utilization = activeUnits / (totalUnits - maintenanceUnits) * 100

  return NextResponse.json({
    title: "Current Fleet",
    prefix: "Managing",
    stat: totalUnits,
    unit: "UNITS",
    metrics: {
      "active": `${activeUnits} vehicles`,
      "maintenance": `${maintenanceUnits} vehicles`,
      "utilization": `${utilization.toFixed(1)}%`,
    },
    lastUpdated: new Date().toISOString(),
  })
}
