"use client"

import type React from "react"

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useRef, useEffect, useState } from "react"
import useSWR from "swr"
import { Package, Truck, Warehouse, BarChart3, MapPin, User, Clock, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"

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
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState<string>("shipments")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const sceneContainer = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const fov = 75;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const clippingPlane = [1, 1000]
    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, clippingPlane[0], clippingPlane[1]);
    camera.position.set(0, 0.2, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneContainer.appendChild(renderer.domElement);

    // Lighting setup
    const lightColor = 0xFFFFFF;

    const ambientLightIntensity = 0.1;
    const ambientLight = new THREE.AmbientLight(lightColor, ambientLightIntensity)

    const directionalLightIntensity = 5;
    const directionalLight = new THREE.DirectionalLight(lightColor, directionalLightIntensity)
    directionalLight.position.set(-3, 0, 5);
    directionalLight.target.position.set(0, 0, 5);

    scene.add(directionalLight.target);
    scene.add(directionalLight);
    scene.add(ambientLight);

    // Mesh setup
    let loadedMesh: THREE.Object3D = null;

    const loader = new GLTFLoader();
    loader.load('/blob.gltf', function(gltf: THREE.Object3D) {
      loadedMesh = gltf.scene;
      scene.add(loadedMesh)
    })

    // Animation and rendering
    function animate() {
      if (loadedMesh) {
        loadedMesh.rotation.x += 0.01;
        loadedMesh.rotation.y += 0.01;
        loadedMesh.rotation.z += 0.01;
      }
      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    // Cleanup scene to avoid duplication
    return () => {
      renderer.setAnimationLoop(null);
      sceneContainer?.removeChild(renderer.domElement);
    };
  }, [])


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

  const navItems = [
    { id: "shipments", icon: Package, label: "ACTIVE SHIPMENTS", number: "01" },
    { id: "fleet", icon: Truck, label: "FLEET MANAGEMENT", number: "02" },
    { id: "users", icon: User, label: "USER MANAGEMENT", number: "03" },
    { id: "locations", icon: Warehouse, label: "LOCATION NETWORK", number: "04" },
    { id: "routes", icon: MapPin, label: "ROUTE OPTIMIZATION", number: "05" },
    { id: "analytics", icon: BarChart3, label: "PERFORMANCE ANALYTICS", number: "06" },
  ]

  return (
    <div className="dashboard-container">
      <div ref={containerRef} className="blobs-container"></div>
      <div className="dashboard-card">
        <div className="dashboard-grid">
          {/* Left Sidebar Navigation */}
          <div className="sidebar">
            {/* Top Header */}
            <div className="sidebar-header">
              {/* TODO: Add action for account settings, on click */}
              <div className="user-info">
                <div className="user-avatar">
                  <User className="user-icon" />
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
              <span>View AI insights</span>
            </button>
          </div>

          {/* Right Content Area */}
          <div className="main-content">
            {/* Top Right Header */}
            <header className="main-header">
              <div className="header-left">
                <div className="status-indicator">
                  <div className="orange-dot pulsing" />
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
                        <div className="status-dot pulsing" />
                      </div>
                      <div className="status-row">
                        <span className="status-label">{activeData.lastUpdated}</span>
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
