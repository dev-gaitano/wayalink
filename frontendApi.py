from flask import Flask, request, jsonify
from flask_cors import CORS
from databaseConnection import db_connection
import os
from dotenv import load_dotenv
import bcrypt
from typing import Any

load_dotenv()

app = Flask(__name__)
CORS(app)

# =====================================================
# USER AUTH
# =====================================================

# User Email Sign Up
@app.route("/api/signup", methods=["POST"])
def signup():
    conn = None
    cursor = None

    try:
        conn = db_connection()
        cursor = conn.cursor()

        signup_data: dict[str, Any] | None = request.get_json()

        if not signup_data:
            return {"success": False, "message": "No JSON data provided"}

        role: str | None = signup_data.get("role")
        gender: str | None = signup_data.get("gender")
        firstname: str | None = signup_data.get("firstname")
        lastname: str | None = signup_data.get("lastname")
        id_number: str | None = signup_data.get("idNumber")
        phone_number: str | None = signup_data.get("phoneNumber")
        signup_email: str | None = signup_data.get("signupemail")
        company_name: str | None = signup_data.get("companyname")
        signup_password: str | None = signup_data.get("signupPassword")
        confirmed_password: str | None = signup_data.get("confirmedPassword")

        def is_user():
            cursor.execute("""
                           SELECT * FROM users WHERE email = %s 
                           """, (signup_email,))
            result = cursor.fetchone()

            if result is None:
                return False
            else:
                return True


        def process_signup(signup_password, confirmed_password) -> dict:
            if signup_password == confirmed_password:
                signup_password = bcrypt.hashpw(signup_password.encode(), bcrypt.gensalt(14))

                user_exists = is_user()

                if user_exists != True:
                    cursor.execute("""
                                   INSERT INTO companies (name) VALUES (%s)
                                   """, (company_name,))

                    # Insert company ID 
                    # Select ID where company_name in comapnies matches user input
                    cursor.execute("""
                                   SELECT id FROM companies WHERE name = %s
                                   """, (company_name,))

                    # Store ID in a variable
                    signup_user_company_id = cursor.fetchone()

                    # Add variable value to users company_id column
                    cursor.execute("""
                                   INSERT INTO users (
                                       company_id,
                                       role,
                                       gender,
                                       firstname,
                                       lastname,
                                       id_number,
                                       phone_number,
                                       email,
                                       password
                                       )
                                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                                   """,
                                   (signup_user_company_id, role, gender, firstname,
                                    lastname, id_number, phone_number, signup_email,
                                    signup_password)
                                   )
                    conn.commit()

                    return {"success": True, "message": "Signup successful"}
                else:
                    return {"success": False, "message": "User already exists"}

            else:
                return {"success": False, "message": "Passwords Do not match"}

        def signupAuth():
            return process_signup(signup_password, confirmed_password)

        result = signupAuth()
        return jsonify(result)

    except Exception as e:
        print(e)
        return {
            "success": False,
            "message": "There was an error Signing up",
            "error": str(e)
        }

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# User Log In
@app.route("/api/login", methods=["POST"])
def login():
    # Get user login data
    login_data = request.get_json()
    login_email = login_data.get("loginEmail")
    login_password = login_data.get("loginPassword")

    # Check if user is_valid_user
    def is_user():
        # Check if email_exists in the database
        db_email = "dev.gaitano@gmail.com"

        if login_email == db_email:
            # If email_exists check if login_password matches
            db_password = bcrypt.hashpw("admin123".encode(), bcrypt.gensalt(14))

            if bcrypt.checkpw(login_password.encode(), db_password):
                is_user = True
            else:
                is_user = False

        else:
            is_user = False

        return is_user

    # Check if user is_admin
    def is_admin():
        return True

    def loginAuth():
        user_exists = is_user()

        if user_exists:
            # Verify if is_admin
            admin_status = is_admin()
            if admin_status:
                return {"success": True, "message": "Login successful"}
            else:
                return {"success": False, "message": "Admin access required"}

        else:
            return {"success": False, "message": "Invalid credentials"}

    result = loginAuth()
    return jsonify(result)



# =====================================================
# DASHBOARD
# =====================================================

# Active Shipments
@app.route("/api/dashboard/active_shipments", methods=["GET"])
def active_shipments():
    conn = db_connection()
    cursor = conn.cursor()

    # Get all status counts
    cursor.execute("""SELECT status, COUNT(DISTINCT tracking_code) as count
                   FROM ( SELECT DISTINCT ON (tracking_code) tracking_code, status
                   FROM shipment_events
                   ORDER BY tracking_code, created_at DESC
                   ) latest_statuses
                   GROUP BY status""")

    all_status_counts = {row[0]: row[1] for row in cursor.fetchall()}

    # Calculate active shipments
    total_active_shipments = sum(
            all_status_counts.get(s, 0)
            for s in ["in_transit", "picked_up", "at_stop"]
            )

    # Calculate delayed and on time shipments
    total_delayed_shipments = all_status_counts.get("delayed", 0)
    total_ontime_shipments = total_active_shipments - total_delayed_shipments

    # Calculate Avg. Delivery time
    # Sum of all delivered shipments times in hours
    cursor.execute("""SELECT SUM(EXTRACT(EPOCH FROM s.delivery_time - s.created_at) / 3600) AS total_hours
                   FROM shipments s
                   JOIN (
                       SELECT DISTINCT ON (tracking_code) tracking_code, status
                       FROM shipment_events
                       ORDER BY tracking_code, created_at DESC
                   ) latest_statuses
                   ON s.tracking_code = latest_statuses.tracking_code
                   WHERE latest_statuses.status = 'delivered';""")

    result = cursor.fetchone()[0]
    sum_of_delivery_hours = int(result) if result is not None else 0

    # count of all delivered shipments
    total_delivered_shipments = all_status_counts.get("delivered", 0)

    # Divide sum by count
    avg_delivery_hours = sum_of_delivery_hours / total_delivered_shipments if total_delivered_shipments > 0 else 0
        
    cursor.close()
    conn.close()

    # Store data in a variable shipments
    active_shipments_data = {
            "total_active_shipments" : total_active_shipments,
            "total_delayed_shipments" : total_delayed_shipments,
            "total_ontime_shipments" : total_ontime_shipments,
            "avg_delivery_hours" : avg_delivery_hours,
            }

    # export data
    return active_shipments_data

# Fleet Management
@app.route("/api/dashboard/fleet_management", methods=["GET"])
def fleet_management():
    conn = db_connection()
    cursor = conn.cursor()

    # Fetch total units
    cursor.execute("SELECT COUNT(*) FROM fleets")
    rows = cursor.fetchone()
    total_units = rows[0] if rows else 0

    # Fetch total active units
    cursor.execute("SELECT COUNT(*) FROM fleets WHERE status = 'in_transit'")
    rows = cursor.fetchone()
    total_active_units = rows[0] if rows else 0

    # Fetch total units under maintenance
    cursor.execute("SELECT COUNT(*) FROM fleets WHERE status = 'maintenance'")
    rows = cursor.fetchone()
    total_under_maintenance = rows[0] if rows else 0

    fleet_management_data = {
            "total_units" : total_units,
            "total_active_units" : total_active_units,
            "total_under_maintenance" : total_under_maintenance,
            }

    return fleet_management_data

# User Management
@app.route("/api/dashboard/user_management", methods=["GET"])
def user_management():
    conn = db_connection()
    cursor = conn.cursor()

    # Fetch total users
    cursor.execute("SELECT COUNT(*) FROM users")
    rows = cursor.fetchone()
    total_users = rows[0] if rows else 0

    # Fetch active users
    cursor.execute("""SELECT COUNT(*) FROM users
                   WHERE is_active = 'true'""")
    rows = cursor.fetchone()
    active_users = rows[0] if rows else 0

    # Fetch inactive users
    cursor.execute("""SELECT COUNT(*) FROM users
                   WHERE is_active = 'false'""")
    rows = cursor.fetchone()
    inactive_users = rows[0] if rows else 0

    # Fetch new users today
    cursor.execute("""SELECT COUNT(*) FROM users
                   WHERE DATE(created_at) = CURRENT_DATE""")
    rows = cursor.fetchone()
    new_users_today = rows[0] if rows else 0

    user_management_data = {
            "total_users" : total_users,
            "active_users" : active_users,
            "inactive_users" : inactive_users,
            "new_users_today" : new_users_today,
            }

    return user_management_data

# Location Network
@app.route("/api/dashboard/location_network", methods=["GET"])
def location_network():
    conn = db_connection()
    cursor = conn.cursor()

    # Fetch total sites
    cursor.execute("SELECT COUNT(*) FROM locations")
    rows = cursor.fetchone()
    total_sites = rows[0] if rows else 0
    
    # Fetch Busiest region, site and site type today (by total shipments)
    cursor.execute("""SELECT l.region, l.name, l.type FROM locations l
                   JOIN (
                       SELECT r.origin_id, COUNT(*) as total_count
                       FROM routes r
                       JOIN shipments s ON r.id = s.route_id
                       WHERE s.created_at >= CURRENT_DATE
                       GROUP BY r.origin_id
                       ORDER BY total_count DESC
                       LIMIT 1
                   ) busiest_origin_today
                   ON l.id = busiest_origin_today.origin_id
                   """)
    rows = cursor.fetchone()
    busiest_region_today = rows[0] if rows else "None"
    busiest_site_today = rows[1] if rows else "None"
    busiest_site_type_today = rows[2] if rows else "None"

    location_network_data = {
            "total_sites" : total_sites,
            "busiest_region_today" : busiest_region_today,
            "busiest_site_today" : busiest_site_today,
            "busiest_site_type_today" : busiest_site_type_today,
            }

    return location_network_data

# Route Optimization
@app.route("/api/dashboard/route_optimization", methods=["GET"])
def route_optimization():
    conn = db_connection()
    cursor = conn.cursor()

    # Fetch total routes
    cursor.execute("SELECT COUNT(*) FROM routes")
    rows = cursor.fetchone()
    total_routes = rows[0] if rows else 0

    # Fetch total active routes
    cursor.execute("""SELECT COUNT(*) FROM routes
                   WHERE is_active = 'true'""")
    rows = cursor.fetchone()
    active_routes = rows[0] if rows else 0

    # Fetch average route distance
    cursor.execute("""SELECT SUM(total_distance_km)
                   FROM routes;
                   """)
    rows = cursor.fetchone()
    sum_of_distances = rows[0] if (rows and rows[0] is not None) else 0

    avg_distance = sum_of_distances / total_routes if total_routes > 0 else 0

    # Fetch average Stops
    cursor.execute("SELECT COUNT(*) FROM route_stops")
    rows = cursor.fetchone()
    total_route_stops = rows[0] if rows else 0
    avg_stops = total_route_stops / total_routes if total_routes > 0 else 0

    route_optimization_data = {
            "total_routes" : total_routes,
            "active_routes" : active_routes,
            "avg_distance" : avg_distance,
            "avg_stops" : avg_stops,
            }

    return route_optimization_data

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
