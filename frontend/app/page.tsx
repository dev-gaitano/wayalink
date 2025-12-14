"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Package, Truck, Warehouse, BarChart3, MapPin, Clock, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"

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

  const { data: shipmentsData, mutate: mutateShipments } = useSWR<LogisticsData>("/api/dashboard/shipments", fetcher, {
    refreshInterval: 5000,
  })
  const { data: fleetData, mutate: mutateFleet } = useSWR<LogisticsData>("/api/dashboard/fleet", fetcher, {
    refreshInterval: 5000,
  })
  const { data: usersData, mutate: mutateUsers } = useSWR<LogisticsData>("/api/dashboard/users", fetcher, {
    refreshInterval: 5000,
  })
  const { data: locationsData, mutate: mutateLocations } = useSWR<LogisticsData>(
    "/api/dashboard/locations",
    fetcher,
    { refreshInterval: 5000 },
  )
  const { data: routesData, mutate: mutateRoutes } = useSWR<LogisticsData>("/api/dashboard/routes", fetcher, {
    refreshInterval: 5000,
  })
  const { data: analyticsData, mutate: mutateAnalytics } = useSWR<LogisticsData>("/api/dashboard/analytics", fetcher, {
    refreshInterval: 5000,
  })

  const dataMap: Record<string, LogisticsData | undefined> = {
    shipments: shipmentsData,
    fleet: fleetData,
    users: usersData,
    locations: locationsData,
    routes: routesData,
    analytics: analyticsData,
  }

  const activeData = dataMap[activeSection]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([mutateShipments(), mutateFleet(), mutateLocations(), mutateRoutes(), mutateUsers(), mutateAnalytics()])
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
    { id: "users", icon: MapPin, label: "USER MANAGEMENT", number: "03" },
    { id: "locations", icon: Warehouse, label: "LOCATION NETWORK", number: "04" },
    { id: "routes", icon: MapPin, label: "ROUTE OPTIMIZATION", number: "05" },
    { id: "analytics", icon: BarChart3, label: "PERFORMANCE ANALYTICS", number: "06" },
  ]

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-grid">
          {/* Left Sidebar Navigation */}
          <div className="sidebar">
            {/* Top Header */}
            <div className="sidebar-header">
              {/* TODO: Add action for account settings, on click */}
              <div className="user-info">
                <div className="user-avatar">
                  <Truck className="truck-icon" />
                </div>
                <div className="user-name">Admin</div>
              </div>
            </div>

            {/* Navigation List */}
            <nav className="nav-container">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`nav-button ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-number">{item.number}</span>
                    <Icon className="nav-icon" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* Footer Link */}
            <button onClick={handleFullReports} className="footer-link">
              <TrendingUp className="trending-icon" />
              <span>View Full Reports</span>
            </button>
          </div>

          {/* Right Content Area */}
          <div className="main-content">
            {/* Top Right Header */}
            <header className="main-header">
              <div className="header-left">
                <div className="status-indicator">
                  <div className="orange-dot" />
                  <span className="brand-name">WAYALINK</span>
                </div>
              </div>

            </header>

            {/* Main Dashboard Content */}
            <div className="dashboard-content">
              {/* Orange Background Block */}
              <div className="orange-block" />

              {/* Background Pattern */}
              <div className="background-pattern" />

              {/* Animated Overlay Text */}
              <div className="overlay-text">
                <div className="overlay-text-content">LIVE</div>
              </div>

              {/* Central Glassmorphic Panel */}
              {activeData ? (
                <div className="central-panel">
                  <div className="central-panel-div-1">
                    <div className="central-panel-header">
                      <p className="panel-prefix">{activeData.prefix}</p>
                      <h2 className="panel-title">{activeData.title}</h2>
                    </div>
                    <div className="metrics-grid">
                      {Object.entries(activeData.metrics).map(([key, value]) => (
                        <div key={key} className="metric-item">
                          <div className="metric-label">{key}</div>
                          <div className="metric-value">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleViewDetails} className="view-details-button">
                    View Details
                    <TrendingUp className="button-icon" />
                  </button>
                </div>
              ) : (
                <div className="loading-panel">
                  <div className="loading-text">Loading data...</div>
                </div>
              )}

              {/* Right Orange Sidebar Content */}
              {activeData && (
                <div className="right-sidebar">

                  <div className="header-right">
                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="refresh-button"
                    >
                      <RefreshCw className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
                      Refresh
                    </button>
                    <form onSubmit={handleSearch} className="search-form">
                      <input
                        type="text"
                        placeholder="Search tracking..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                    </form>
                  </div>

                  <div className="content-right">
                    <div className="stats-container">
                      <div className="stat-number">{activeData.stat}</div>
                      <div className="stat-unit-container">
                        <div className="stat-unit">{activeData.unit}</div>
                        <AlertCircle onClick={handleMonitor} className="monitor-button" />
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="status-indicators">
                      <div className="status-row">
                        <span className="status-label">Status</span>
                        <div className="status-dot" />
                      </div>
                      <div className="status-row">
                        <span className="status-label">Live</span>
                        <Clock className="live-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements - Package Icons */}
        <div className="decorative-icon icon-1">
          <Package className="decorative-icon-package" />
        </div>
        <div className="decorative-icon icon-2">
          <Truck className="decorative-icon-truck" />
        </div>
        <div className="decorative-icon icon-3">
          <Warehouse className="decorative-icon-warehouse" />
        </div>
      </div>
    </div>
  )
}
