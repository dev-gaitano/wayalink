import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const totalVehicles = 156
  const activeVehicles = 140 + Math.floor(Math.random() * 5)
  const maintenanceVehicles = totalVehicles - activeVehicles

  return NextResponse.json({
    title: "Fleet Management",
    prefix: "Managing",
    stat: totalVehicles.toString(),
    unit: "UNITS",
    metrics: {
      active: `${activeVehicles} vehicles`,
      maintenance: `${maintenanceVehicles} vehicles`,
      utilization: `${(85 + Math.random() * 10).toFixed(1)}%`,
    },
    lastUpdated: new Date().toISOString(),
    vehicles: [
      { id: "FL-001", type: "Truck", status: "active", location: "Route 66", fuel: "78%" },
      { id: "FL-002", type: "Van", status: "active", location: "Downtown", fuel: "45%" },
      { id: "FL-003", type: "Truck", status: "maintenance", location: "Garage A", fuel: "100%" },
      { id: "FL-004", type: "Truck", status: "active", location: "Highway 101", fuel: "92%" },
      { id: "FL-005", type: "Van", status: "active", location: "Suburbs", fuel: "65%" },
    ],
  })
}
