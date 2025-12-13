"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Package, Truck, Warehouse, BarChart3, MapPin, Clock, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type LogisticsData = {
  title: string
  prefix: string
  stat: string
  unit: string
  metrics: Record<string, string>
  lastUpdated?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function LogisticsDashboard() {
  const [activeSection, setActiveSection] = useState<string>("shipments")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: shipmentsData, mutate: mutateShipments } = useSWR<LogisticsData>("/api/logistics/shipments", fetcher, {
    refreshInterval: 5000,
  })
  const { data: fleetData, mutate: mutateFleet } = useSWR<LogisticsData>("/api/logistics/fleet", fetcher, {
    refreshInterval: 5000,
  })
  const { data: warehousesData, mutate: mutateWarehouses } = useSWR<LogisticsData>(
    "/api/logistics/warehouses",
    fetcher,
    { refreshInterval: 5000 },
  )
  const { data: analyticsData, mutate: mutateAnalytics } = useSWR<LogisticsData>("/api/logistics/analytics", fetcher, {
    refreshInterval: 5000,
  })
  const { data: routesData, mutate: mutateRoutes } = useSWR<LogisticsData>("/api/logistics/routes", fetcher, {
    refreshInterval: 5000,
  })

  const dataMap: Record<string, LogisticsData | undefined> = {
    shipments: shipmentsData,
    fleet: fleetData,
    warehouses: warehousesData,
    analytics: analyticsData,
    routes: routesData,
  }

  const activeData = dataMap[activeSection]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([mutateShipments(), mutateFleet(), mutateWarehouses(), mutateAnalytics(), mutateRoutes()])
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const handleViewDetails = () => {
    alert(`Opening detailed view for ${activeData?.title}`)
  }

  const handleMonitor = () => {
    alert(`Opening monitoring dashboard for ${activeData?.title}`)
  }

  const handleFullReports = () => {
    alert("Opening full analytics reports...")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`)
    }
  }

  const navItems = [
    { id: "shipments", icon: Package, label: "ACTIVE SHIPMENTS", number: "01" },
    { id: "fleet", icon: Truck, label: "FLEET MANAGEMENT", number: "02" },
    { id: "warehouses", icon: Warehouse, label: "WAREHOUSE NETWORK", number: "03" },
    { id: "analytics", icon: BarChart3, label: "PERFORMANCE ANALYTICS", number: "04" },
    { id: "routes", icon: MapPin, label: "ROUTE OPTIMIZATION", number: "05" },
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-5">
      <div className="w-full max-w-7xl h-[600px] rounded-3xl shadow-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10">
        <div className="grid grid-cols-12 h-full">
          {/* Left Sidebar Navigation */}
          <div className="col-span-4 bg-[#e5e5e5] p-6 flex flex-col justify-between relative z-20">
            {/* Top Header */}
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#ff6b35] border-2 border-white shadow-md flex items-center justify-center">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-700">Admin</div>
              </div>
            </div>

            {/* Navigation List */}
            <nav className="flex-grow space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      w-full flex items-center text-sm font-semibold tracking-wider cursor-pointer transition-all duration-300
                      ${isActive
                        ? "bg-[#ff6b35] text-white -mx-6 pr-6 my-4 py-4 shadow-lg relative"
                        : "text-gray-500 hover:text-[#ff6b35] py-2"
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#ff6b35] rounded-full" />
                    )}
                    <span className={`mr-4 w-6 text-right ${isActive ? "text-white" : "text-gray-400"}`}>
                      {item.number}
                    </span>
                    <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-white" : "text-gray-400"}`} />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* Footer Link */}
            <button
              onClick={handleFullReports}
              className="text-sm text-gray-400 mt-10 flex items-center space-x-2 cursor-pointer hover:text-[#ff6b35] transition"
            >
              <TrendingUp className="h-5 w-5" />
              <span>View Full Reports</span>
            </button>
          </div>

          {/* Right Content Area */}
          <div className="col-span-8 relative flex flex-col">
            {/* Top Right Header */}
            <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30">
              <div className="flex items-center space-x-4 text-white/80">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="tracking-widest text-sm font-semibold">WAYALINK</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-white/80">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="text-white/80 hover:text-white"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search tracking..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none transition duration-300 text-sm placeholder:text-white/60 px-2 pb-1 w-32"
                  />
                </form>
              </div>
            </header>

            {/* Main Dashboard Content */}
            <div className="flex-grow relative overflow-hidden">
              {/* Orange Background Block */}
              <div className="absolute inset-y-0 right-0 w-1/3 bg-[#ff6b35] z-10" />

              {/* Background Pattern */}
              <div className="absolute inset-0 z-20 opacity-20">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              {/* Animated Overlay Text */}
              <div className="absolute inset-0 flex justify-center items-center z-25 pointer-events-none">
                <div className="text-[16rem] font-black text-white/5 leading-none select-none">LIVE</div>
              </div>

              {/* Central Glassmorphic Panel */}
              {activeData ? (
                <div className="absolute z-40 p-8 w-[60%] h-[35%] top-1/2 left-0 transform -translate-y-1/2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-r-3xl shadow-2xl">
                  <p className="text-xl font-light text-gray-100 mb-1">{activeData.prefix}</p>
                  <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">{activeData.title}</h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(activeData.metrics).map(([key, value]) => (
                      <div key={key} className="text-white/90">
                        <div className="text-xs uppercase tracking-wider text-white/60 mb-1">{key}</div>
                        <div className="text-sm font-bold">{value}</div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleViewDetails}
                    className="bg-[#ff6b35] hover:bg-[#ff5722] hover:cursor-pointer text-white rounded-full shadow-lg"
                  >
                    View Details
                    <TrendingUp className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="absolute z-40 p-8 w-[60%] h-[35%] top-1/2 left-0 transform -translate-y-1/2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-r-3xl shadow-2xl flex items-center justify-center">
                  <div className="text-white/60">Loading data...</div>
                </div>
              )}

              {/* Right Orange Sidebar Content */}
              {activeData && (
                <div className="absolute right-0 inset-y-0 w-1/3 p-6 flex flex-col justify-end items-end text-white z-30">
                  <Button
                    variant="ghost"
                    onClick={handleMonitor}
                    className="uppercase text-xs font-bold tracking-widest text-white hover:text-gray-200 hover:cursor-pointer mb-4"
                  >
                    Monitor
                    {/* Add a hover property for alert Icon */}
                    <AlertCircle className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="text-[8rem] font-black leading-none mb-8">{activeData.stat}</div>
                  <div className="text-sm tracking-widest mb-10">{activeData.unit}</div>

                  {/* Status Indicators */}
                  <div className="flex flex-col gap-2 w-full items-end text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-white/80">Status</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80">Live</span>
                      <Clock className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements - Package Icons */}
        <div className="absolute top-[15%] left-[35%] opacity-10 pointer-events-none z-50">
          <Package className="w-8 h-8 text-white rotate-12" />
        </div>
        <div className="absolute top-[50%] left-[45%] opacity-10 pointer-events-none z-50">
          <Truck className="w-10 h-10 text-white -rotate-6" />
        </div>
        <div className="absolute top-[70%] left-[32%] opacity-10 pointer-events-none z-50">
          <Warehouse className="w-7 h-7 text-white rotate-45" />
        </div>
      </div>
    </div>
  )
}
