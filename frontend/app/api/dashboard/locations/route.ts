import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    title: "Location Network",
    prefix: "Operating",
    stat: "24",
    unit: "SITES",
    metrics: {
      capacity: `${(85 + Math.random() * 5).toFixed(1)}%`,
      processing: `${(1.0 + Math.random() * 0.5).toFixed(1)}K orders`,
      efficiency: `${(95 + Math.random() * 3).toFixed(1)}%`,
    },
    lastUpdated: new Date().toISOString(),
    locations: [
      { id: "bc2a9703-6732-4019-be86-8f5b24f917b2", name: "Kikuyu Textiles Ltd", type: "manufacturer", gps_lat: -1.2495000, gps_lon: 36.6673000, region: "Kiambu" },
      { id: "fe14dbc7-3fcd-4e91-b4da-1443f05a3b0d", name: "Nairobi Central Warehouse", type: "warehouse", gps_lat: -1.2863890, gps_lon: 36.8172230, region: "Nairobi" },
      { id: "ae1c05d9-5101-457f-8d8d-87545ee03030", name: "Nakuru Storage Depot", type: "warehouse", gps_lat: -0.3030990, gps_lon: 36.0800250, region: "Nakuru" },
      { id: "a1c05d4c-9329-457c-890a-8ae082b66315", name: "Eldoret Retail Hub", type: "retailer", gps_lat: 0.5203600, gps_lon: 35.2697800, region: "Uasin Gishu" },
      { id: "d0aefc0a-fdd5-492b-837b-576ed7e460c2", name: "Kisumu Market Outlet", type: "retailer", gps_lat: -0.0917020, gps_lon: 34.7679560, region: "Kisumu" },
    ],
  })
}
