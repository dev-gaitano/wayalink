"""
Supply Chain Database Seed Data Generator
Generates realistic data for the Wayalink supply chain management system
"""

import uuid
from datetime import datetime, timedelta
import random
from databaseConnection import db_connection

# Seed for reproducibility
random.seed(42)

# Data configuration
NUM_LOCATIONS = 50
NUM_ROUTES = 36
NUM_FLEETS = 28
NUM_USERS = 43
NUM_SHIPMENTS = 2687

# Kenyan regions and their major towns
KENYA_LOCATIONS = {
    'Nairobi': [
        {'name': 'Industrial Area', 'lat': -1.2921, 'lon': 36.8219},
        {'name': 'Westlands', 'lat': -1.2676, 'lon': 36.8078},
        {'name': 'Karen', 'lat': -1.3192, 'lon': 36.7076},
        {'name': 'Embakasi', 'lat': -1.3167, 'lon': 36.8833},
        {'name': 'Kasarani', 'lat': -1.2220, 'lon': 36.8989},
        {'name': 'Kilimani', 'lat': -1.2921, 'lon': 36.7833},
        {'name': 'Eastleigh', 'lat': -1.2750, 'lon': 36.8444},
    ],
    'Mombasa': [
        {'name': 'Shimanzi', 'lat': -4.0435, 'lon': 39.6682},
        {'name': 'Nyali', 'lat': -4.0300, 'lon': 39.7200},
        {'name': 'Changamwe', 'lat': -4.0167, 'lon': 39.6333},
        {'name': 'Likoni', 'lat': -4.0833, 'lon': 39.6667},
        {'name': 'Bamburi', 'lat': -3.9833, 'lon': 39.7167},
    ],
    'Kisumu': [
        {'name': 'Mamboleo', 'lat': -0.0917, 'lon': 34.7680},
        {'name': 'Kondele', 'lat': -0.1000, 'lon': 34.7500},
        {'name': 'Milimani', 'lat': -0.0850, 'lon': 34.7600},
        {'name': 'Nyalenda', 'lat': -0.1100, 'lon': 34.7450},
    ],
    'Nakuru': [
        {'name': 'Lanet', 'lat': -0.3031, 'lon': 36.0800},
        {'name': 'Section 58', 'lat': -0.2833, 'lon': 36.0667},
        {'name': 'Free Area', 'lat': -0.2800, 'lon': 36.0700},
        {'name': 'Milimani', 'lat': -0.2900, 'lon': 36.0650},
    ],
    'Eldoret': [
        {'name': 'Kapsoya', 'lat': 0.5143, 'lon': 35.2698},
        {'name': 'Uganda Road', 'lat': 0.5199, 'lon': 35.2697},
        {'name': 'Langas', 'lat': 0.5300, 'lon': 35.2800},
        {'name': 'Pioneer', 'lat': 0.5150, 'lon': 35.2750},
    ],
    'Thika': [
        {'name': 'Blue Post', 'lat': -1.0332, 'lon': 37.0690},
        {'name': 'Makongeni', 'lat': -1.0400, 'lon': 37.0800},
        {'name': 'Kiandutu', 'lat': -1.0450, 'lon': 37.0750},
    ],
    'Machakos': [
        {'name': 'Town Center', 'lat': -1.5177, 'lon': 37.2634},
        {'name': 'Syokimau', 'lat': -1.3167, 'lon': 36.9167},
    ],
    'Kitale': [
        {'name': 'Town Center', 'lat': 1.0157, 'lon': 34.9582},
    ],
    'Garissa': [
        {'name': 'Town Center', 'lat': -0.4536, 'lon': 39.6461},
    ],
    'Malindi': [
        {'name': 'Town Center', 'lat': -3.2167, 'lon': 40.1167},
    ],
    'Kiambu': [
        {'name': 'Town Center', 'lat': -1.1714, 'lon': 36.8356},
        {'name': 'Ruaka', 'lat': -1.2167, 'lon': 36.8000},
    ],
    'Meru': [
        {'name': 'Town Center', 'lat': 0.0500, 'lon': 37.6500},
    ],
}

LOCATION_TYPES = ['manufacturer', 'warehouse', 'retailer', 'custom']
FLEET_TYPES = ['truck', 'van', 'pickup', 'trailer']
VEHICLE_MODELS = {
    'truck': ['Isuzu FRR', 'Mercedes Actros', 'Mitsubishi Canter', 'Scania R500', 'Volvo FH16', 'MAN TGX', 'DAF XF'],
    'van': ['Nissan NV350', 'Toyota HiAce', 'Mercedes Sprinter', 'Ford Transit', 'Volkswagen Crafter'],
    'pickup': ['Toyota Hilux', 'Mitsubishi L200', 'Isuzu D-Max', 'Ford Ranger', 'Nissan Navara'],
    'trailer': ['Custom Trailer', 'Refrigerated Trailer', 'Flatbed Trailer', 'Container Trailer']
}

SHIPMENT_STATUSES = ['created', 'picked_up', 'in_transit', 'at_stop', 'delayed', 'delivered', 'cancelled', 'failed']
PRIORITIES = ['low', 'normal', 'high', 'urgent']
USER_ROLES = ['driver', 'manager', 'admin', 'warehouse_staff', 'customer_service']

CARGO_TYPES = [
    'Electronics and Computer Equipment',
    'Medical Supplies and Pharmaceuticals',
    'Agricultural Equipment',
    'Textiles and Clothing',
    'Office Furniture',
    'Building Materials',
    'Food and Beverages',
    'Automotive Parts',
    'Industrial Machinery',
    'Consumer Goods',
    'Books and Stationery',
    'Household Appliances',
]

# Kenyan first and last names
FIRST_NAMES = [
    'John', 'Mary', 'Peter', 'Grace', 'David', 'Jane', 'James', 'Lucy',
    'Samuel', 'Alice', 'Robert', 'Sarah', 'Michael', 'Nancy', 'Daniel',
    'Catherine', 'George', 'Margaret', 'Victor', 'Rose', 'Patrick', 'Elizabeth',
    'Simon', 'Francis', 'Anthony', 'Eugene', 'Joseph', 'Ruth', 'Paul', 'Ann',
    'Stephen', 'Faith', 'Kevin', 'Joyce', 'Brian', 'Agnes', 'Dennis', 'Esther'
]

LAST_NAMES = [
    'Kamau', 'Wanjiku', 'Omondi', 'Akinyi', 'Mwangi', 'Njeri', 'Otieno',
    'Wambui', 'Kipchoge', 'Cherotich', 'Mutua', 'Kibet', 'Chepkemoi', 'Koech',
    'Jeptoo', 'Odhiambo', 'Adhiambo', 'Onyango', 'Kimutai', 'Nyambura',
    'Kariuki', 'Wangari', 'Njoroge', 'Wairimu', 'Gitau', 'Achieng', 'Kiprop',
    'Nyokabi', 'Mulei', 'Juma', 'Wekesa', 'Makau', 'Musyoka', 'Barasa'
]

COMPANY_NAMES = [
    'Tech Solutions Ltd', 'Kisumu General Hospital', 'Corporate Hub',
    'Eldoret Farmers Coop', 'Fashion Boutique', 'Supreme Electronics',
    'Nairobi Medical Centre', 'Greenfields Agriculture', 'Metro Supermarket',
    'Build Mart', 'Kenya Auto Parts', 'Safari Textiles', 'Fresh Foods Ltd'
]


def generate_uuid():
    """Generate a UUID4"""
    return str(uuid.uuid4())


def generate_kenyan_plate():
    """Generate realistic Kenyan number plate"""
    prefix = random.choice(['KC', 'KD', 'KE', 'KA', 'KB', 'KBZ', 'KBY'])
    numbers = random.randint(100, 999)
    suffix = random.choice('ABCDEFGHJKLMNPQRSTUVWXYZ')
    return f"{prefix} {numbers}{suffix}"


def generate_tracking_code(year, sequence):
    """Generate tracking code in format SHP-YYYY-NNNN"""
    return f"SHP-{year}-{sequence:04d}"


def generate_phone_number():
    """Generate Kenyan phone number"""
    prefix = random.choice(['71', '72', '73', '74', '75', '76', '77', '78', '79', '70'])
    return f"+254{prefix}{random.randint(1000000, 9999999)}"


def clear_existing_data(connection):
    """Clear existing seed data"""
    cursor = connection.cursor()
    print("Clearing existing data...")
    cursor.execute("""
        TRUNCATE TABLE shipment_events, shipments, route_stops, routes, 
                      fleets, users, locations RESTART IDENTITY CASCADE;
    """)
    connection.commit()
    cursor.close()
    print("✓ Data cleared")


def generate_locations(connection):
    """Generate location data"""
    cursor = connection.cursor()
    print(f"Generating {NUM_LOCATIONS} locations...")
    
    locations = []
    location_ids = []
    
    for region, towns in KENYA_LOCATIONS.items():
        for town in towns:
            for _ in range(random.randint(1, 3)):
                if len(locations) >= NUM_LOCATIONS:
                    break
                    
                loc_id = generate_uuid()
                loc_type = random.choice(LOCATION_TYPES)
                type_suffix = {
                    'manufacturer': random.choice(['Manufacturing Hub', 'Production Center', 'Factory', 'Assembly Plant']),
                    'warehouse': random.choice(['Warehouse', 'Distribution Center', 'Storage Facility', 'Depot']),
                    'retailer': random.choice(['Store', 'Outlet', 'Branch', 'Shop', 'Mall']),
                    'custom': random.choice(['Depot', 'Terminal', 'Hub', 'Collection Point'])
                }[loc_type]
                
                name = f"{town['name']} {type_suffix}"
                lat = round(town['lat'] + random.uniform(-0.01, 0.01), 7)
                lon = round(town['lon'] + random.uniform(-0.01, 0.01), 7)
                address = f"{random.randint(1, 999)} {random.choice(['Road', 'Street', 'Avenue', 'Drive'])}, {town['name']}"
                
                locations.append((loc_id, name, loc_type, lat, lon, address, region, 'Kenya'))
                location_ids.append(loc_id)
                
            if len(locations) >= NUM_LOCATIONS:
                break
        if len(locations) >= NUM_LOCATIONS:
            break
    
    # Batch insert
    cursor.execute("""
        INSERT INTO locations (id, name, type, latitude, longitude, address, region, country) VALUES
    """ + ",\n".join([f"('{loc[0]}', '{loc[1]}', '{loc[2]}', {loc[3]}, {loc[4]}, '{loc[5]}', '{loc[6]}', '{loc[7]}')" for loc in locations]))
    
    connection.commit()
    cursor.close()
    print(f"✓ Generated {len(locations)} locations")
    return location_ids


def generate_routes(connection, location_ids):
    """Generate route data"""
    cursor = connection.cursor()
    print(f"Generating {NUM_ROUTES} routes...")
    
    routes = []
    route_ids = []
    route_stops_data = []
    
    for _ in range(NUM_ROUTES):
        route_id = generate_uuid()
        origin = random.choice(location_ids)
        destination = random.choice([lid for lid in location_ids if lid != origin])
        
        distance = round(random.uniform(50, 600), 2)
        duration = round(distance / 60, 2)
        is_active = random.choice([True, True, True, False])
        
        routes.append((route_id, f"Route-{len(routes)+1}", origin, destination, distance, duration, is_active))
        route_ids.append((route_id, origin, destination))
    
    # Batch insert routes
    cursor.execute("""
        INSERT INTO routes (id, name, origin_id, destination_id, total_distance_km, 
                           estimated_duration_hours, is_active) VALUES
    """ + ",\n".join([f"('{r[0]}', '{r[1]}', '{r[2]}', '{r[3]}', {r[4]}, {r[5]}, {r[6]})" for r in routes]))
    
    # Generate route stops
    for route_id, origin_id, dest_id in route_ids:
        if random.random() < 0.4:
            num_stops = random.randint(1, 3)
            available_stops = [lid for lid in location_ids if lid not in [origin_id, dest_id]]
            if len(available_stops) >= num_stops:
                stops = random.sample(available_stops, num_stops)
                
                for idx, stop_id in enumerate(stops, 1):
                    stop_id_uuid = generate_uuid()
                    route_stops_data.append((
                        stop_id_uuid, route_id, stop_id, idx,
                        round(random.uniform(20, 150), 2),
                        round(random.uniform(0.5, 3.0), 2)
                    ))
    
    if route_stops_data:
        cursor.execute("""
            INSERT INTO route_stops (id, route_id, location_id, stop_order, 
                                    distance_from_previous_km, estimated_time_hours) VALUES
        """ + ",\n".join([f"('{rs[0]}', '{rs[1]}', '{rs[2]}', {rs[3]}, {rs[4]}, {rs[5]})" for rs in route_stops_data]))
    
    connection.commit()
    cursor.close()
    print(f"✓ Generated {len(routes)} routes with {len(route_stops_data)} stops")
    return [r[0] for r in routes]


def generate_fleets(connection, location_ids):
    """Generate fleet data"""
    cursor = connection.cursor()
    print(f"Generating {NUM_FLEETS} vehicles...")
    
    fleets = []
    fleet_ids = []
    used_plates = set()
    
    for _ in range(NUM_FLEETS):
        fleet_id = generate_uuid()
        fleet_type = random.choice(FLEET_TYPES)
        model = random.choice(VEHICLE_MODELS[fleet_type])
        year = random.randint(2015, 2024)
        
        while True:
            plate = generate_kenyan_plate()
            if plate not in used_plates:
                used_plates.add(plate)
                break
        
        capacity_kg = {
            'truck': random.randint(3000, 10000),
            'van': random.randint(1000, 2000),
            'pickup': random.randint(500, 1500),
            'trailer': random.randint(5000, 15000)
        }[fleet_type]
        
        capacity_m3 = round(capacity_kg / 200, 2)
        fuel_capacity = {
            'truck': random.randint(150, 300),
            'van': random.randint(60, 100),
            'pickup': random.randint(70, 90),
            'trailer': random.randint(200, 400)
        }[fleet_type]
        
        mileage = random.randint(10000, 200000)
        status = random.choices(
            ['available', 'in_transit', 'maintenance', 'retired'],
            weights=[50, 30, 15, 5]
        )[0]
        
        last_maintenance = (datetime.now() - timedelta(days=random.randint(30, 180))).date()
        next_maintenance = (datetime.fromisoformat(str(last_maintenance)) + timedelta(days=random.randint(60, 120))).date()
        
        fleets.append((
            fleet_id, model, year, plate, fleet_type, fuel_capacity,
            capacity_kg, capacity_m3, mileage, status, random.choice(location_ids),
            last_maintenance, next_maintenance
        ))
        fleet_ids.append(fleet_id)
    
    cursor.execute("""
        INSERT INTO fleets (id, model, year_of_manufacture, number_plate, type, 
                           fuel_capacity_litres, capacity_kg, capacity_cubic_meters,
                           current_mileage_km, status, location_id, 
                           last_maintenance_date, next_maintenance_date) VALUES
    """ + ",\n".join([f"('{f[0]}', '{f[1]}', {f[2]}, '{f[3]}', '{f[4]}', {f[5]}, {f[6]}, {f[7]}, {f[8]}, '{f[9]}', '{f[10]}', '{f[11]}', '{f[12]}')" for f in fleets]))
    
    connection.commit()
    cursor.close()
    print(f"✓ Generated {len(fleets)} vehicles")
    return fleet_ids


def generate_users(connection, location_ids):
    """Generate user data"""
    cursor = connection.cursor()
    print(f"Generating {NUM_USERS} users...")
    
    users = []
    user_ids_by_role = {'driver': [], 'manager': [], 'admin': [], 'warehouse_staff': [], 'customer_service': []}
    used_phones = set()
    used_emails = set()
    
    role_counts = {
        'admin': 3,
        'manager': 5,
        'driver': 18,
        'warehouse_staff': 10,
        'customer_service': 4
    }
    
    for role, count in role_counts.items():
        for _ in range(count):
            user_id = generate_uuid()
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            name = f"{first_name} {last_name}"
            
            while True:
                phone = generate_phone_number()
                if phone not in used_phones:
                    used_phones.add(phone)
                    break
            
            while True:
                email = f"{first_name.lower()}.{last_name.lower()}@wayalink.co.ke"
                if email not in used_emails:
                    used_emails.add(email)
                    break
                email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 99)}@wayalink.co.ke"
                if email not in used_emails:
                    used_emails.add(email)
                    break
            
            id_number = f"{random.randint(10000000, 99999999)}"
            
            title = {
                'admin': random.choice(['Chief Operations Officer', 'Operations Director', 'Head of Logistics']),
                'manager': random.choice(['Regional Manager', 'Operations Manager', 'Logistics Manager']),
                'driver': random.choice(['Senior Driver', 'Driver', 'Lead Driver']),
                'warehouse_staff': random.choice(['Warehouse Supervisor', 'Inventory Clerk', 'Warehouse Associate']),
                'customer_service': random.choice(['Customer Service Manager', 'CS Agent', 'Support Specialist'])
            }[role]
            
            is_active = random.choice([True, True, True, False])
            
            users.append((user_id, id_number, phone, email, name, title, role, is_active, random.choice(location_ids)))
            user_ids_by_role[role].append(user_id)
    
    cursor.execute("""
        INSERT INTO users (id, id_number, phone_number, email, name, title, role, 
                          is_active, location_id) VALUES
    """ + ",\n".join([f"('{u[0]}', '{u[1]}', '{u[2]}', '{u[3]}', '{u[4]}', '{u[5]}', '{u[6]}', {u[7]}, '{u[8]}')" for u in users]))
    
    connection.commit()
    cursor.close()
    print(f"✓ Generated {len(users)} users")
    return user_ids_by_role


def generate_shipments_and_events(connection, route_ids, fleet_ids, user_ids_by_role, location_ids):
    """Generate shipments and their events"""
    cursor = connection.cursor()
    print(f"Generating {NUM_SHIPMENTS} shipments with events...")
    
    shipments = []
    all_events = []
    current_year = datetime.now().year
    
    # Get some routes with their origin/destination for realistic event locations
    cursor.execute("SELECT id, origin_id, destination_id FROM routes WHERE is_active = TRUE")
    route_details = cursor.fetchall()
    
    for seq in range(1, NUM_SHIPMENTS + 1):
        shipment_id = generate_uuid()
        tracking_code = generate_tracking_code(current_year, seq)
        
        # Select route
        if route_details:
            route = random.choice(route_details)
            route_id, origin_id, destination_id = route[0], route[1], route[2]
        else:
            route_id = random.choice(route_ids) if route_ids else None
            origin_id = None
            destination_id = None
        
        fleet_id = random.choice(fleet_ids) if fleet_ids else None
        driver_id = random.choice(user_ids_by_role['driver']) if user_ids_by_role['driver'] else None
        
        description = random.choice(CARGO_TYPES)
        weight_kg = round(random.uniform(100, 5000), 2)
        volume_m3 = round(weight_kg / 200, 2)
        priority = random.choice(PRIORITIES)
        
        customer_name = random.choice(COMPANY_NAMES)
        customer_phone = generate_phone_number()
        customer_email = f"orders@{customer_name.lower().replace(' ', '')}.co.ke"
        
        # Create shipment with realistic timestamps
        days_ago = random.randint(0, 30)
        created_at = datetime.now() - timedelta(days=days_ago, hours=random.randint(0, 23))
        
        # Determine final status based on age
        if days_ago > 5:
            final_status = random.choices(
                ['delivered', 'cancelled', 'failed'],
                weights=[80, 15, 5]
            )[0]
        elif days_ago > 2:
            final_status = random.choices(
                ['delivered', 'in_transit', 'delayed'],
                weights=[50, 40, 10]
            )[0]
        else:
            final_status = random.choices(
                ['created', 'picked_up', 'in_transit', 'at_stop'],
                weights=[20, 30, 40, 10]
            )[0]
        
        estimated_delivery = created_at + timedelta(days=random.randint(1, 5))
        actual_delivery = None
        
        if final_status == 'delivered':
            actual_delivery = created_at + timedelta(days=random.randint(1, 4), hours=random.randint(0, 23))
        
        last_update = created_at
        
        shipments.append((
            shipment_id, tracking_code, route_id, fleet_id, driver_id,
            description, weight_kg, volume_m3, priority, customer_name,
            customer_phone, customer_email, estimated_delivery, actual_delivery, created_at
        ))
        
        # Generate events for this shipment
        status_progression = {
            'created': ['created'],
            'picked_up': ['created', 'picked_up'],
            'in_transit': ['created', 'picked_up', 'in_transit'],
            'at_stop': ['created', 'picked_up', 'in_transit', 'at_stop'],
            'delayed': ['created', 'picked_up', 'in_transit', 'delayed'],
            'delivered': ['created', 'picked_up', 'in_transit', 'delivered'],
            'cancelled': ['created', 'cancelled'],
            'failed': ['created', 'picked_up', 'in_transit', 'failed']
        }
        
        statuses = status_progression.get(final_status, ['created'])
        event_time = created_at
        
        for status in statuses:
            event_id = generate_uuid()
            event_time = event_time + timedelta(hours=random.randint(1, 12))
            
            # Determine location based on status
            if status == 'created':
                event_location = origin_id
            elif status in ['delivered', 'failed']:
                event_location = destination_id
            elif status == 'at_stop':
                # Try to get a stop from route_stops
                cursor.execute("SELECT location_id FROM route_stops WHERE route_id = %s LIMIT 1", (route_id,))
                stop_result = cursor.fetchone()
                event_location = stop_result[0] if stop_result else random.choice(location_ids)
            else:
                event_location = random.choice([origin_id, destination_id, None])
            
            recorded_by = random.choice(user_ids_by_role['driver'] + user_ids_by_role['warehouse_staff'])
            
            notes = {
                'created': 'Shipment created and documented',
                'picked_up': f'Loaded onto vehicle {random.choice(["successfully", "carefully", "securely"])}',
                'in_transit': random.choice(['On route', 'Making good progress', 'Smooth journey', 'En route to destination']),
                'at_stop': random.choice(['Rest stop', 'Refueling', 'Break time', 'Scheduled stop']),
                'delayed': random.choice(['Traffic delay', 'Weather conditions', 'Vehicle maintenance', 'Road closure']),
                'delivered': 'Successfully delivered and signed off',
                'cancelled': 'Shipment cancelled by customer',
                'failed': 'Delivery attempt unsuccessful'
            }.get(status, '')
            
            # Get coordinates if location exists
            if event_location:
                cursor.execute("SELECT latitude, longitude FROM locations WHERE id = %s", (event_location,))
                loc_result = cursor.fetchone()
                if loc_result:
                    lat, lon = loc_result[0], loc_result[1]
                else:
                    lat, lon = None, None
            else:
                # Random coordinates for in-transit events
                lat = round(-1.0 + random.uniform(-3, 1), 7)
                lon = round(36.0 + random.uniform(-3, 4), 7)
            
            all_events.append((
                event_id, None, tracking_code, recorded_by, event_location,
                status, lat, lon, event_time, notes
            ))
            
            last_update = event_time
    
    # Batch insert shipments
    shipment_values = []
    for s in shipments:
        route_val = f"'{s[2]}'" if s[2] else 'NULL'
        fleet_val = f"'{s[3]}'" if s[3] else 'NULL'
        driver_val = f"'{s[4]}'" if s[4] else 'NULL'
        actual_delivery_val = f"'{s[13]}'" if s[13] else 'NULL'
        
        shipment_values.append(
            f"('{s[0]}', '{s[1]}', {route_val}, {fleet_val}, {driver_val}, "
            f"'{s[5]}', {s[6]}, {s[7]}, '{s[8]}', '{s[9]}', "
            f"'{s[10]}', '{s[11]}', '{s[12]}', {actual_delivery_val}, '{s[14]}')"
        )
    
    cursor.execute("""
        INSERT INTO shipments (id, tracking_code, route_id, fleet_id, driver_id, description,
                              weight_kg, volume_cubic_meters, priority, customer_name,
                              customer_phone, customer_email, estimated_delivery, actual_delivery, created_at) VALUES
    """ + ",\n".join(shipment_values))
    
    # Batch insert events
    event_values = []
    for e in all_events:
        session_val = f"'{e[1]}'" if e[1] else 'NULL'
        recorded_val = f"'{e[3]}'" if e[3] else 'NULL'
        location_val = f"'{e[4]}'" if e[4] else 'NULL'
        lat_val = str(e[6]) if e[6] else 'NULL'
        lon_val = str(e[7]) if e[7] else 'NULL'
        
        event_values.append(
            f"('{e[0]}', {session_val}, '{e[2]}', {recorded_val}, {location_val}, "
            f"'{e[5]}', {lat_val}, {lon_val}, '{e[8]}', '{e[9]}')"
        )
    
    cursor.execute("""
        INSERT INTO shipment_events (id, session_id, tracking_code, recorded_by, location_id,
                                     status, latitude, longitude, created_at, notes) VALUES
    """ + ",\n".join(event_values))
    
    connection.commit()
    cursor.close()
    print(f"✓ Generated {len(shipments)} shipments with {len(all_events)} events")


def seed_data():
    """Main seeding function"""
    print("=" * 60)
    print("WAYALINK SUPPLY CHAIN DATABASE SEEDER")
    print("=" * 60)
    
    connection = db_connection()
    
    try:
        # Clear existing data
        clear_existing_data(connection)
        
        # Generate data in order
        location_ids = generate_locations(connection)
        route_ids = generate_routes(connection, location_ids)
        fleet_ids = generate_fleets(connection, location_ids)
        user_ids_by_role = generate_users(connection, location_ids)
        generate_shipments_and_events(connection, route_ids, fleet_ids, user_ids_by_role, location_ids)
        
        # Verification
        print("\n" + "=" * 60)
        print("DATA VERIFICATION")
        print("=" * 60)
        
        cursor = connection.cursor()
        tables = ['locations', 'routes', 'route_stops', 'fleets', 'users', 'shipments', 'shipment_events']
        
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"✓ {table.capitalize()}: {count} records")
        
        cursor.close()
        
        print("\n" + "=" * 60)
        print("DATABASE SEEDED SUCCESSFULLY!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        connection.rollback()
        raise
    finally:
        connection.close()


if __name__ == "__main__":
    seed_data()
