import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    title: "Active Users",
    prefix: "Managing",
    stat: 67,
    unit: "USERS",
    metrics: {
      shipmentEvents: `${(92 + Math.random() * 4).toFixed(1)}`,
      fuelSaved: `${(15 + Math.random() * 5).toFixed(1)}%`,
      avgTime: `${(3.0 + Math.random() * 0.5).toFixed(1)} hrs`,
    },
    lastUpdated: new Date().toISOString(),
    users: [
      { id: "a1b23d48 - f111 - 4d5f - a8b7 - c84f8ef1a2b3", phone_number: "+254712345678", id_number: "12345678", name: "John Kamau", role: "admin", location_id: "bc2a9703 - 6732 - 4019 - be86 - 8f5b24f917b2" },
      { id: "b2c34d56 - f222 - 4d5f - a8b7 - c84f8ef1a2b3", phone_number: "+254723456789", id_number: "23456789", name: "Mary Wanjiku", role: "field", location_id: "bc2a9703 - 6732 - 4019 - be86 - 8f5b24f917b2" },
      { id: "c3d45e6f - f333 - 4d5f - a8b7 - c84f8ef1a2b3", phone_number: "+254734567890", id_number: "34567890", name: "Peter Omondi", role: "field", location_id: "bc2a9703 - 6732 - 4019 - be86 - 8f5b24f917b2" },
      { id: "d4e56fa7 - 4444 - 4d5f - a8b7 - c84f8ef1a2b3", phone_number: "+254745678901", id_number: "45678901", name: "Grace Akinyi", role: "field", location_id: "bc2a9703 - 6732 - 4019 - be86 - 8f5b24f917b2" },
      { id: "e5f67e0a - f555 - 4d5f - a8b7 - c84f8ef1a2b3", phone_number: "+254756789012", id_number: "56789012", name: "David Mwangi", role: "admin", location_id: "fe14dbc7 - 3fcd - 4e91 - b4da - 1443f05a3b0d" },
    ],
  })
}
