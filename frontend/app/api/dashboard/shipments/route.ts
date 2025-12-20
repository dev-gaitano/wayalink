import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  // Fetch data from API
  const req = await fetch(
    "https://wayalink-production.up.railway.app/api/dashboard/active_shipments",
    { cache: "no-store" }
  );

  // Store data in a variable as JSON
  const active_shipments_data = await req.json();

  // Calculate metrics
  const activeShipments = Number(active_shipments_data.total_active_shipments)

  let delayedPercentage = 0;
  let onTimePercentage = 0;
  if (active_shipments_data.total_active_shipments > 0) {
    delayedPercentage =
      100 * (active_shipments_data.total_delayed_shipments / active_shipments_data.total_active_shipments);
    onTimePercentage =
      100 * (active_shipments_data.total_ontime_shipments / active_shipments_data.total_active_shipments);
  }

  // Convert Avg. time to relevant time unit
  const avgDeliveryDays = Number(active_shipments_data.avg_delivery_hours) / 24;

  return NextResponse.json({
    title: "Active Shipments",
    prefix: "Tracking",
    stat: activeShipments,
    unit: "ACTIVE SHIPMENTS",
    metrics: {
      "on-time": `${onTimePercentage.toFixed(1)}%`,
      "delayed": `${delayedPercentage.toFixed(1)}%`,
      "avg.delivery": `${avgDeliveryDays.toFixed(1)} days`,
    },
    lastUpdated: new Date().toISOString(),
  })
}
