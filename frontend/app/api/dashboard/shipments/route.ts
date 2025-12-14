import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  // Fetch data from backend active_shipments API
  const req = await fetch(
    "https://wayalink-production.up.railway.app/api/dashboard/active_shipments",
    { cache: "no-store" }
  );

  // Store data in a variable as JSON
  const active_shipments = await req.json();

  // Calculate metrics
  let delayedPercentage = 0;
  let onTimePercentage = 0;
  if (active_shipments.total_active_shipments > 0) {
    delayedPercentage =
      100 * (active_shipments.total_delayed_shipments / active_shipments.total_active_shipments);
    onTimePercentage =
      100 * (active_shipments.total_ontime_shipments / active_shipments.total_active_shipments);
  }

  // Convert Avg. time to relevant time unit
  const avgDeliveryDays = active_shipments.avg_delivery_hours / 24;

  return NextResponse.json({
    title: "Active Shipments",
    prefix: "Tracking",
    stat: active_shipments.total_active_shipments,
    unit: "ACTIVE SHIPMENTS",
    metrics: {
      onTime: `${onTimePercentage.toFixed(1)}%`,
      delayed: `${delayedPercentage.toFixed(1)}%`,
      avgDelivery: `${avgDeliveryDays.toFixed(1)} days`,
    },
  })
}
