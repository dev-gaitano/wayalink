import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  // Simulate real-time data with slight variations
  const now = new Date()
  const onTimePercentage = 94 + Math.random() * 2
  const delayedPercentage = (100 - onTimePercentage).toFixed(1)

  return NextResponse.json({
    title: "Active Shipments",
    prefix: "Tracking",
    stat: (2800 + Math.floor(Math.random() * 100)).toString(),
    unit: "LIVE",
    metrics: {
      onTime: `${onTimePercentage.toFixed(1)}%`,
      delayed: `${delayedPercentage}%`,
      avgDelivery: `${(2 + Math.random() * 0.8).toFixed(1)} days`,
    },
    lastUpdated: now.toISOString(),
    shipments: [
      { id: "SH-2024-001", status: "in-transit", destination: "New York", eta: "2 hours" },
      { id: "SH-2024-002", status: "delivered", destination: "Los Angeles", eta: "Delivered" },
      { id: "SH-2024-003", status: "delayed", destination: "Chicago", eta: "4 hours" },
      { id: "SH-2024-004", status: "in-transit", destination: "Houston", eta: "6 hours" },
      { id: "SH-2024-005", status: "in-transit", destination: "Phoenix", eta: "3 hours" },
    ],
  })
}
