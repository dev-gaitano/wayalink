-- =====================================================
-- DATABASE: PostgreSQL
-- SUPPLY CHAIN MANAGEMENT SYSTEM
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS shipment_events CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS route_stops CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS fleets CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS locations CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- LOCATIONS TABLE
-- =====================================================
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(15) NOT NULL CHECK (
        type IN (
            'manufacturer',
            'warehouse',
            'retailer',
            'custom'
        )
    ),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    address TEXT,
    region VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_locations_region ON locations(region);

-- =====================================================
-- ROUTES TABLE
-- =====================================================
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    origin_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    destination_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    total_distance_km NUMERIC(10, 2) NOT NULL CHECK (total_distance_km > 0),
    estimated_duration_hours NUMERIC(6, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_different_locations CHECK (origin_id != destination_id)
);

CREATE INDEX idx_routes_origin ON routes(origin_id);
CREATE INDEX idx_routes_destination ON routes(destination_id);
CREATE INDEX idx_routes_active ON routes(is_active);

-- =====================================================
-- ROUTE STOPS TABLE (Junction table for multiple stops)
-- =====================================================
CREATE TABLE route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    stop_order INT NOT NULL CHECK (stop_order > 0),
    distance_from_previous_km NUMERIC(10, 2),
    estimated_time_hours NUMERIC(6, 2),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_route_stop_order UNIQUE (route_id, stop_order)
);

CREATE INDEX idx_route_stops_route ON route_stops(route_id);
CREATE INDEX idx_route_stops_location ON route_stops(location_id);

-- =====================================================
-- FLEETS TABLE
-- =====================================================
CREATE TABLE fleets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model VARCHAR(100) NOT NULL,
    year_of_manufacture INT NOT NULL CHECK (
        year_of_manufacture >= 1900 AND 
        year_of_manufacture <= EXTRACT(YEAR FROM NOW()) + 1
    ),
    number_plate VARCHAR(20) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (
        type IN ('truck', 'van', 'pickup', 'trailer')
    ),
    fuel_capacity_litres INT NOT NULL CHECK (fuel_capacity_litres > 0),
    capacity_kg NUMERIC(10, 2),
    capacity_cubic_meters NUMERIC(10, 2),
    current_mileage_km INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available' CHECK (
        status IN ('available', 'in_transit', 'maintenance', 'retired')
    ),
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    last_maintenance_date DATE,
    next_maintenance_date DATE
);

CREATE INDEX idx_fleets_number_plate ON fleets(number_plate);
CREATE INDEX idx_fleets_status ON fleets(status);
CREATE INDEX idx_fleets_location ON fleets(location_id);

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_number VARCHAR(50) UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(50),
    role VARCHAR(30) CHECK (
        role IN ('driver', 'manager', 'admin', 'warehouse_staff', 'customer_service')
    ),
    is_active BOOLEAN DEFAULT TRUE,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(location_id);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- SHIPMENTS TABLE
-- =====================================================
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code VARCHAR(50) NOT NULL UNIQUE,
    route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
    fleet_id UUID REFERENCES fleets(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    description TEXT,
    weight_kg NUMERIC(10, 2),
    volume_cubic_meters NUMERIC(10, 2),
    priority VARCHAR(15) DEFAULT 'normal' CHECK (
        priority IN ('low', 'normal', 'high', 'urgent')
    ),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    estimated_delivery TIMESTAMP WITHOUT TIME ZONE,
    actual_delivery TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    last_update TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shipments_tracking_code ON shipments(tracking_code);
CREATE INDEX idx_shipments_route ON shipments(route_id);
CREATE INDEX idx_shipments_fleet ON shipments(fleet_id);
CREATE INDEX idx_shipments_driver ON shipments(driver_id);
CREATE INDEX idx_shipments_estimated_delivery ON shipments(estimated_delivery);

-- =====================================================
-- SHIPMENT_EVENTS TABLE
-- =====================================================
CREATE TABLE shipment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100),
    tracking_code VARCHAR(50) NOT NULL REFERENCES shipments(tracking_code) ON DELETE CASCADE,
    recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL CHECK (
        status IN (
            'created',
            'picked_up',
            'in_transit',
            'at_stop',
            'delayed',
            'delivered',
            'cancelled',
            'failed'
        )
    ),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    notes TEXT
);

CREATE INDEX idx_events_tracking_code ON shipment_events(tracking_code);
CREATE INDEX idx_events_recorded_by ON shipment_events(recorded_by);
CREATE INDEX idx_events_location ON shipment_events(location_id);
CREATE INDEX idx_events_created_at ON shipment_events(created_at DESC);
CREATE INDEX idx_events_status ON shipment_events(status);

-- =====================================================
-- TRIGGERS
-- Automatically update timestamps and maintain data integrity
-- =====================================================

-- Function to update last_update timestamp on shipments
CREATE OR REPLACE FUNCTION update_shipment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE shipments 
    SET last_update = NEW.created_at 
    WHERE tracking_code = NEW.tracking_code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update shipment timestamp when event is logged
CREATE TRIGGER trg_update_shipment_timestamp
AFTER INSERT ON shipment_events
FOR EACH ROW
EXECUTE FUNCTION update_shipment_timestamp();

-- Function to get current shipment status (most recent event)
CREATE OR REPLACE FUNCTION get_shipment_current_status(p_tracking_code VARCHAR(50))
RETURNS VARCHAR(20) AS $$
DECLARE
    v_status VARCHAR(20);
BEGIN
    SELECT status INTO v_status
    FROM shipment_events
    WHERE tracking_code = p_tracking_code
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN v_status;
END;
$$ LANGUAGE plpgsql;
