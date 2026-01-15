import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  // Fetch data from API
  const req = await fetch(
    "https://wayalink-api.onrender.com/api/dashboard/location_network",
    { cache: "no-store" }
  )

  // Store data in a variable as JSON
  const location_network_data = await req.json()

  const totalSites = location_network_data.total_sites
  const busiestRegionToday = location_network_data.busiest_region_today
  const busiestSiteToday = location_network_data.busiest_site_today
  const busiestSiteTypeToday = location_network_data.busiest_site_type_today

  return NextResponse.json({
    title: "Location Network",
    prefix: "Today's Operating",
    stat: totalSites,
    unit: "SITES",
    metrics: {
      "busiest-region": busiestRegionToday,
      "busiest-site-name": busiestSiteToday,
      "busiest-site-type": busiestSiteTypeToday,
    },
    lastUpdated: new Date(),
  })
}
