from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from databaseConnection import db_connection
import os
from dotenv import load_dotenv
import bcrypt
from typing import Any
import jwt
from datetime import datetime, timedelta
from functools import wraps

# Config
load_dotenv()

app = Flask(__name__)

# Setup env variables
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
if not app.config["JWT_SECRET_KEY"]:
    raise RuntimeError("JWT_SECRET_KEY not set")

# Setup CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://wayalink.vercel.app" 
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# =====================================================
# USER AUTH
# =====================================================
# Generate JWT Token
def generate_jwt_token(user_id: str | None, firstname: str | None, email: str | None) -> str:
    payload: dict[str, Any] = {
        "user_id" : str(user_id),
        "firstname" : firstname,
        "email" : email,
        "exp" : datetime.utcnow() + timedelta(minutes=30),
        "iat" : datetime.utcnow()
    }

    jwt_token: str = jwt.encode(
        payload,
        app.config["JWT_SECRET_KEY"],
        algorithm="HS256"
    )

    return jwt_token

# Verify JWT Token
def jwt_token_required(f):
    @wraps(f)
    def decorated_func(*args, **kwargs):
        jwt_token: str | None = request.headers.get("Authorization")

        if not jwt_token:
            return jsonify({
                "success" : False,
                "message" : "Token not found"
            }), 401

        if not jwt_token.startswith("Bearer "):
            return jsonify({
                "success" : False,
                "message" : "Invalid token format"
            }), 401

        jwt_token = jwt_token[7:]

        try:
                jwt_data: dict = jwt.decode(
                    jwt_token,
                    app.config["JWT_SECRET_KEY"],
                    leeway=timedelta(minutes=2),
                    algorithms=["HS256"]
                )

                current_user_id = jwt_data["user_id"]

        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "message": "Token has expired",
                "expired": True
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "message": "Invalid token"
            }), 401

        return f(current_user_id, *args, **kwargs)

    return decorated_func


# User Email Signup
@app.route("/api/signup", methods=["POST"])
def signup() -> Response:
    conn = None
    cursor = None

    try:
        conn = db_connection()
        cursor = conn.cursor()

        # Get user signup data
        signup_data: dict[str, Any] | None = request.get_json()

        if not signup_data:
            return jsonify({
                "success": False,
                "message": "No JSON data provided"
            })

        gender: str | None = signup_data.get("gender")
        firstname: str | None = signup_data.get("firstname")
        lastname: str | None = signup_data.get("lastname")
        id_number: str | None = signup_data.get("idNumber")
        phone_number: str | None = signup_data.get("phoneNumber")
        signup_email: str | None = signup_data.get("signupEmail")
        company_name: str | None = signup_data.get("companyname")
        signup_password: str | None = signup_data.get("signupPassword")
        confirmed_password: str | None = signup_data.get("confirmedPassword")

        if not all([gender, firstname, lastname, id_number, phone_number,
                    signup_email, company_name, signup_password,
                    confirmed_password]):
            return jsonify({
                "success" : False,
                "message" : "All input fields required"
            })

        # Check if passwords match
        if signup_password == confirmed_password:
            hashed_password = bcrypt.hashpw(signup_password.encode(), bcrypt.gensalt(12)).decode('utf-8')

            # Check if user exists
            cursor.execute("""
                           SELECT * FROM users
                           WHERE email = %s 
                           """, (signup_email,))
            user: tuple | None = cursor.fetchone()

            if not user:
                # Insert company
                cursor.execute("""
                               INSERT INTO companies (name)
                               VALUES (%s)
                               RETURNING id
                               """, (company_name,))
                company_id_result: tuple | None = cursor.fetchone()

                if not company_id_result:
                    return jsonify({
                        "success": False,
                        "message": "Failed to create company"
                    })

                signup_user_company_id = company_id_result[0]

                # Insert user
                cursor.execute("""
                               INSERT INTO users (
                                   company_id,
                                   gender,
                                   firstname,
                                   lastname,
                                   id_number,
                                   phone_number,
                                   email,
                                   password,
                                   is_active,
                                   last_login
                                   )
                               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                               RETURNING id
                               """,
                               (signup_user_company_id, gender, firstname,
                                lastname, id_number, phone_number, signup_email,
                                hashed_password, True)
                               )
                user_id_result: tuple | None = cursor.fetchone()

                if not user_id_result:
                    return jsonify({
                        "success": False,
                        "message": "Failed to create user"
                    })

                user_id = user_id_result[0]
                conn.commit()

                jwt_token = generate_jwt_token(user_id, firstname, signup_email)

                return jsonify({
                    "success": True,
                    "message": "Signup successful",
                    "token" : jwt_token,
                    "user": {
                        "id": str(user_id),
                        "email": signup_email,
                        "firstname": firstname
                    }
                })

            else:
                return jsonify({
                    "success": False,
                    "message": "User already exists"
                })

        else:
            return jsonify({
                "success": False,
                "message": "Passwords Do not match"
            })

    except Exception as e:
        if conn:
            conn.rollback()

        return jsonify({
            "success": False,
            "message": "There was an error Signing up",
            "error": str(e)
        })

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# User Email Login
@app.route("/api/login", methods=["POST"])
def login() -> Response:
    conn = None
    cursor = None

    try:
        conn = db_connection()
        cursor = conn.cursor()

        # Get login data
        login_data: dict[str, Any] | None = request.get_json()
        if not login_data:
            return jsonify({
                "success": False,
                "message": "No JSON data provided"
            })

        login_email: str | None = login_data.get("loginEmail")
        login_password: str | None = login_data.get("loginPassword")
        if not login_email or not login_password:
            return jsonify({
                "success": False,
                "message": "Email and password required"
            })

        # Check if user exists
        cursor.execute("""
                       SELECT id, role, firstname, email, password FROM users
                       WHERE email = %s
                       """, (login_email,))

        user: tuple | None = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            })

        user_id, role, firstname, db_email, db_password = user

        # Validate password
        if bcrypt.checkpw(login_password.encode(), db_password.encode()):
            # Verify if is admin
            if role.lower() == "admin":
                cursor.execute("""
                               UPDATE users
                               SET last_login = NOW() WHERE id = %s
                               """, (user_id,))
                conn.commit()

                jwt_token = generate_jwt_token(user_id, firstname, db_email)

                return jsonify({
                    "success": True,
                    "message": "Login successful",
                    "token" : jwt_token,
                    "user": {
                        "id": str(user_id),
                        "email": db_email,
                        "firstname": firstname
                    }
                })

            else:
                return jsonify({
                    "success": False,
                    "message": "Admin access required"
                })
        else:
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            })

    except Exception as e:
        if conn:
            conn.rollback()

        return jsonify({
            "success": False,
            "message": "There was an error Logging in",
            "error": str(e)
        })

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Verify token endpoint
@app.route("/api/verify_token", methods=["GET"])
@jwt_token_required
def verify_token(current_user_id: str) -> Response:
    return jsonify({
        "success" : True,
        "valid" : True,
        "user_id" : current_user_id
    })

@app.route("/api/check-user-exists", methods=["POST"])
def check_user_exists() -> Response:
    conn = None
    cursor = None

    try:
        conn = db_connection()
        cursor = conn.cursor()

        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"exists": False})

        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user_id: tuple | None = cursor.fetchone()

        return jsonify({"exists" : bool(user_id)})

    except Exception as e:
        return jsonify({
            "success" : False,
            "message" : "Error checking if user exists",
            "error" : str(e),
            "exists" : False
            })

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()



# =====================================================
# DASHBOARD
# =====================================================
# Active shipments endpoint
@app.route("/api/dashboard/active_shipments", methods=["GET"])
def active_shipments():
    conn = None
    cursor = None

    try:
        conn = db_connection()
        cursor = conn.cursor()

        # Get all status counts
        cursor.execute("""
                       SELECT status, COUNT(DISTINCT tracking_code) as count
                       FROM ( SELECT DISTINCT ON (tracking_code) tracking_code, status
                       FROM shipment_events
                       ORDER BY tracking_code, created_at DESC
                       ) latest_statuses
                       GROUP BY status
                       """)

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
        cursor.execute("""
                       SELECT SUM(EXTRACT(EPOCH FROM s.delivery_time - s.created_at) / 3600)
                       AS total_hours
                       FROM shipments s
                       JOIN (
                           SELECT DISTINCT ON (tracking_code) tracking_code, status
                           FROM shipment_events
                           ORDER BY tracking_code, created_at DESC
                       ) latest_statuses
                       ON s.tracking_code = latest_statuses.tracking_code
                       WHERE latest_statuses.status = 'delivered'
                       """)

        result = cursor.fetchone()[0]
        sum_of_delivery_hours = int(result) if result is not None else 0

        # count of all delivered shipments
        total_delivered_shipments = all_status_counts.get("delivered", 0)

        # Divide sum by count
        if total_delivered_shipments > 0:
            avg_delivery_hours = sum_of_delivery_hours / total_delivered_shipments
        else:
            avg_delivery_hours = 0

        # Store data in a variable shipments
        active_shipments_data = {
                "total_active_shipments" : total_active_shipments,
                "total_delayed_shipments" : total_delayed_shipments,
                "total_ontime_shipments" : total_ontime_shipments,
                "avg_delivery_hours" : avg_delivery_hours,
                }

        # export data
        return jsonify(active_shipments_data)

    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": "There was an error processing active shipments",
            "error": str(e)
        })

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Fleet management endpoint
@app.route("/api/dashboard/fleet_management", methods=["GET"])
def fleet_management():
    conn = None
    cursor = None

    try:
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

        return jsonify(fleet_management_data)

    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": "There was an error processing fleet management",
            "error": str(e)
        })

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# User management endpoint
@app.route("/api/dashboard/user_management", methods=["GET"])
def user_management() -> Response:
    conn = None
    cursor = None

    try:
        conn = db_connection()
        cursor = conn.cursor()

        # Fetch total users
        cursor.execute("SELECT COUNT(*) FROM users")
        rows = cursor.fetchone()
        total_users = rows[0] if rows else 0

        # Fetch active users
        cursor.execute("SELECT COUNT(*) FROM users WHERE is_active = true")
        rows = cursor.fetchone()
        active_users = rows[0] if rows else 0

        # Fetch inactive users
        cursor.execute("SELECT COUNT(*) FROM users WHERE is_active = false")
        rows = cursor.fetchone()
        inactive_users = rows[0] if rows else 0

        # Fetch new users today
        cursor.execute("""
                       SELECT COUNT(*) FROM users
                       WHERE DATE(created_at) = CURRENT_DATE
                       """)
        rows = cursor.fetchone()
        new_users_today = rows[0] if rows else 0

        user_management_data = {
                "total_users" : total_users,
                "active_users" : active_users,
                "inactive_users" : inactive_users,
                "new_users_today" : new_users_today,
                }

        return jsonify(user_management_data)

    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": "There was an error processing user management",
            "error": str(e)
        })

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Location Network
@app.route("/api/dashboard/location_network", methods=["GET"])
def location_network() -> Response:
    conn = None
    cursor = None

    try:
        conn = db_connection()
        cursor = conn.cursor()

        # Fetch total sites
        cursor.execute("SELECT COUNT(*) FROM locations")
        rows = cursor.fetchone()
        total_sites = rows[0] if rows else 0
        
        # Fetch Busiest region, site and site type today (by total shipments)
        cursor.execute("""
                       SELECT l.region, l.name, l.type FROM locations l
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

        return jsonify(location_network_data)

    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": "There was an error processing location network",
            "error": str(e)
        })

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Route Optimization
@app.route("/api/dashboard/route_optimization", methods=["GET"])
def route_optimization() -> Response:
    conn = None
    cursor = None

    try:
        conn = db_connection()
        cursor = conn.cursor()

        # Fetch total routes
        cursor.execute("SELECT COUNT(*) FROM routes")
        rows = cursor.fetchone()
        total_routes = rows[0] if rows else 0

        # Fetch total active routes
        cursor.execute("SELECT COUNT(*) FROM routes WHERE is_active = true")
        rows = cursor.fetchone()
        active_routes = rows[0] if rows else 0

        # Fetch average route distance
        cursor.execute("SELECT SUM(total_distance_km) FROM routes")
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

        return jsonify(route_optimization_data)

    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": "There was an error processing route optimization",
            "error": str(e)
        })

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
