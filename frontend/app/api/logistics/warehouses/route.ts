import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    title: "Warehouse Network",
    prefix: "Operating",
    stat: "24",
    unit: "SITES",
    metrics: {
      capacity: `${(85 + Math.random() * 5).toFixed(1)}%`,
      processing: `${(1.0 + Math.random() * 0.5).toFixed(1)}K orders`,
      efficiency: `${(95 + Math.random() * 3).toFixed(1)}%`,
    },
    lastUpdated: new Date().toISOString(),
    warehouses: [
      { id: "WH-001", location: "California", capacity: "92%", status: "operational" },
      { id: "WH-002", location: "Texas", capacity: "78%", status: "operational" },
      { id: "WH-003", location: "Florida", capacity: "65%", status: "operational" },
      { id: "WH-004", location: "New York", capacity: "88%", status: "operational" },
      { id: "WH-005", location: "Illinois", capacity: "71%", status: "operational" },
    ],
  })
}
