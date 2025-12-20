import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  // Fetch data from API
  const req = await fetch(
    "https://wayalink-production.up.railway.app/api/dashboard/route_optimization",
    { cache: "no-store" }
  )

  // Store data in a variable as JSON
  const route_optimization_data = await req.json()

  const totalRoutes = Number(route_optimization_data.total_routes)
  const activeRoutes = Number(route_optimization_data.active_routes)
  const avgDistance = Number(route_optimization_data.avg_distance)
  const avgStops = Number(route_optimization_data.avg_stops)

  return NextResponse.json({
    title: "Route Optimization",
    prefix: "Monitoring",
    stat: totalRoutes,
    unit: "ROUTES",
    metrics: {
      "active-routes": `${(activeRoutes)} routes`,
      "avg.distance": `${(avgDistance).toFixed(1)} Km`,
      "avg.stops": `${(avgStops).toFixed(1)} stops`,
    },
    lastUpdated: new Date().toISOString(),
  })
}
