import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"

export async function GET() {
  // Fetch data from API
  const req = await fetch(
    "https://wayalink-api.onrender.com/api/dashboard/user_management",
    { cache: "no-store" }
  )

  // Store data in a variable as JSON
  const user_management_data = await req.json()

  const totalUsers = Number(user_management_data.total_users)
  const activeUsers = Number(user_management_data.active_users)
  const inactiveUsers = Number(user_management_data.inactive_users)
  const newUsers = Number(user_management_data.new_users_today)

  return NextResponse.json({
    title: "Daily Users",
    prefix: "Managing",
    stat: totalUsers,
    unit: "USERS",
    metrics: {
      "active": `${activeUsers} users`,
      "inactive": `${inactiveUsers} users`,
      "new": `${newUsers} users`,
    },
    lastUpdated: new Date().toISOString(),
  })
}
