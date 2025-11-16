import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    title: "Performance Analytics",
    prefix: "Monitoring",
    stat: (97 + Math.random() * 2).toFixed(1),
    unit: "SCORE",
    metrics: {
      satisfaction: `${(4.5 + Math.random() * 0.5).toFixed(1)}/5.0`,
      costSaving: `$${(2.0 + Math.random() * 0.8).toFixed(1)}M`,
      growth: `+${(20 + Math.random() * 5).toFixed(1)}%`,
    },
    lastUpdated: new Date().toISOString(),
    insights: [
      { metric: "Delivery Time", trend: "down", value: "-12%", status: "improving" },
      { metric: "Customer Satisfaction", trend: "up", value: "+8%", status: "excellent" },
      { metric: "Operating Costs", trend: "down", value: "-15%", status: "optimized" },
    ],
  })
}
