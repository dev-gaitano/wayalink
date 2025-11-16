import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    title: "Route Optimization",
    prefix: "Optimizing",
    stat: (840 + Math.floor(Math.random() * 20)).toString(),
    unit: "ROUTES",
    metrics: {
      efficiency: `${(92 + Math.random() * 4).toFixed(1)}%`,
      fuelSaved: `${(15 + Math.random() * 5).toFixed(1)}%`,
      avgTime: `${(3.0 + Math.random() * 0.5).toFixed(1)} hrs`,
    },
    lastUpdated: new Date().toISOString(),
    optimizedRoutes: [
      { id: "RT-001", from: "Warehouse A", to: "Zone 1", savings: "23%", status: "active" },
      { id: "RT-002", from: "Warehouse B", to: "Zone 2", savings: "18%", status: "active" },
      { id: "RT-003", from: "Warehouse C", to: "Zone 3", savings: "31%", status: "active" },
    ],
  })
}
