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
    unit: "SHIPMENTS",
    metrics: {
      onTime: `${onTimePercentage.toFixed(1)}%`,
      delayed: `${delayedPercentage}%`,
      avgDelivery: `${(2 + Math.random() * 0.8).toFixed(1)} days`,
    },
    lastUpdated: now.toISOString(),
    shipments: [
      { id: "11111111-1111-1111-1111-111111111111", tracking_code: "WL-2025-001", route_id: "bc2a9703-6732-4019-be86-8f5b24f917b2", status: "delivered" },
      { id: "22222222-2222-2222-2222-222222222222", tracking_code: "WL-2025-002", route_id: "bc2a9703-6732-4019-be86-8f5b24f917b2", status: "delivered" },
      { id: "33333333-3333-3333-3333-333333333333", tracking_code: "WL-2025-003", route_id: "bc2a9703-6732-4019-be86-8f5b24f917b2", status: "in_transit" },
      { id: "44444444-4444-4444-4444-444444444444", tracking_code: "WL-2025-004", route_id: "bc2a9703-6732-4019-be86-8f5b24f917b2", status: "in_transit" },
      { id: "55555555-5555-5555-5555-555555555555", tracking_code: "WL-2025-005", route_id: "fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d", status: "delivered" },
    ],
  })
}
