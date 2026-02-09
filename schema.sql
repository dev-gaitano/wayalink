DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS fleets CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS route_stops CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS shipment_events CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS companies (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(255) UNIQUE NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS locations (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(50) UNIQUE NOT NULL,
	type VARCHAR(15) NOT NULL,
	latitude NUMERIC(10,2),
	longitude NUMERIC(10,2),
	address TEXT NOT NULL,
	country_code VARCHAR(3) NOT NULL,
	region VARCHAR(100) NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	company_id UUID REFERENCES companies(id) NOT NULL,
	role VARCHAR(50) NOT NULL,
	gender VARCHAR(6),
	firstname VARCHAR(50) NOT NULL,
	lastname VARCHAR(50) NOT NULL,
	id_number VARCHAR(10) UNIQUE NOT NULL,
	phone_number VARCHAR(13) UNIQUE NOT NULL,
	email VARCHAR(255) UNIQUE,
	password VARCHAR(255) UNIQUE NOT NULL,
	location_id UUID REFERENCES locations(id) NOT NULL,
	is_active BOOLEAN,
	last_login TIMESTAMP,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	company_id UUID REFERENCES companies(id) NOT NULL,
	name VARCHAR(50) NOT NULL,
	phone_number VARCHAR(13) NOT NULL,
	email VARCHAR(255),
	type VARCHAR(255) NOT NULL,
	location_id UUID REFERENCES locations(id) NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fleets (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	company_id UUID REFERENCES companies(id) NOT NULL,
	type VARCHAR(5) NOT NULL CHECK (
		type IN ('Truck', 'Pickup', 'Van', 'Trailer')
	),
	model VARCHAR(100) NOT NULL,
	year_of_manufacture INT NOT NULL,
	number_plate VARCHAR(10) NOT NULL,
	mileage_km INT,
	status VARCHAR(8) NOT NULL DEFAULT 'Available' CHECK (
		status IN ('In Transit', 'Available', 'In Maintenance', 'Retired')
	),
	last_maitenance TIMESTAMP,
	location_id UUID REFERENCES locations(id) NOT NULL,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routes (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	company_id UUID REFERENCES companies(id) NOT NULL,
	name VARCHAR(50) NOT NULL,
	origin_id UUID REFERENCES locations(id) NOT NULL,
	destination_id UUID REFERENCES locations(id) NOT NULL,
	total_distance_km NUMERIC (10,2),
	estimated_time_hours NUMERIC(6, 2),
	is_active BOOLEAN,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS route_stops (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	route_id UUID REFERENCES routes(id) NOT NULL,
	location_id UUID REFERENCES locations(id) NOT NULL,
	stop_order INT NOT NULL,
	distance_from_previous_stop NUMERIC(10,2),
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipments (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	company_id UUID REFERENCES companies(id) NOT NULL,
	tracking_code VARCHAR(15) UNIQUE NOT NULL,
	route_id UUID REFERENCES routes(id) NOT NULL,
	fleet_id UUID REFERENCES fleets(id) NOT NULL,
	driver_id UUID REFERENCES users(id) NOT NULL,
	customer_id UUID REFERENCES clients(id) NOT NULL,
	description TEXT,
	priority VARCHAR(6) DEFAULT 'normal' CHECK (
		priority IN ('low', 'normal', 'high', 'urgent')
	),
	delivery_time TIMESTAMP,
	last_update TIMESTAMP,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipment_events (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	session_id VARCHAR(30) NOT NULL,
	tracking_code VARCHAR(15) REFERENCES shipments(tracking_code) NOT NULL,
	recorded_by UUID REFERENCES users(id) NOT NULL,
	location_id UUID REFERENCES locations(id) NOT NULL,
	status VARCHAR(8) NOT NULL CHECK (
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
	notes TEXT,
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
