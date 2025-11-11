-- =====================================================
-- DATABASE: PostgreSQL
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS shipment_events CASCADE;

DROP TABLE IF EXISTS shipments CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS locations CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- LOCATIONS TABLE
-- =====================================================
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name TEXT NOT NULL,
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
    region TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_locations_type ON locations(type);

CREATE INDEX idx_locations_region ON locations (region);

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    id_number TEXT,
    phone_number TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    title VARCHAR(50),
    location_id UUID REFERENCES locations (id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users (phone_number);

CREATE INDEX idx_users_location ON users (location_id);

-- =====================================================
-- SHIPMENTS TABLE
-- =====================================================
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    tracking_code VARCHAR(50) NOT NULL UNIQUE,
    origin_id UUID REFERENCES locations (id) ON DELETE SET NULL,
    destination_id UUID REFERENCES locations (id) ON DELETE SET NULL,
    status VARCHAR(15),
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    last_update TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shipments_tracking_code ON shipments (tracking_code);

CREATE INDEX idx_shipments_status ON shipments (status);

CREATE INDEX idx_shipments_origin ON shipments (origin_id);

CREATE INDEX idx_shipments_destination ON shipments (destination_id);

-- =====================================================
-- SHIPMENT_EVENTS TABLE
-- =====================================================
CREATE TABLE shipment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    session_id TEXT,
    tracking_code VARCHAR(50) NOT NULL,
    recorded_by UUID REFERENCES users (id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations (id) ON DELETE SET NULL,
    status VARCHAR(15) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    notes TEXT
);

CREATE INDEX idx_events_tracking_code ON shipment_events (tracking_code);

CREATE INDEX idx_events_recorded_by ON shipment_events (recorded_by);

CREATE INDEX idx_events_location ON shipment_events (location_id);

CREATE INDEX idx_events_created_at ON shipment_events (created_at DESC);

CREATE INDEX idx_events_status ON shipment_events (status);

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