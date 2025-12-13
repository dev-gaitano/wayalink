"""
WayaLink Dashboard API Routes
Flask REST API endpoints for the admin dashboard
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from database_connection import db_connection

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# =====================================================
# DASHBOARD ANALYTICS
# =====================================================

@app.route("/api/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    """Get overview statistics for dashboard"""
    try:
        connection = db_connection()
        cursor = connection.cursor()
        
        # Total shipments
        cursor.execute("SELECT COUNT(*) FROM shipments")
        total_shipments = cursor.fetchone()[0]
        
        # Active shipments (in_transit, pending)
        cursor.execute("""
            SELECT COUNT(*) FROM shipments 
            WHERE status IN ('In Transit', 'pending', 'Picked Up')
        """)
        active_shipments = cursor.fetchone()[0]
        
        # Delivered shipments
        cursor.execute("SELECT COUNT(*) FROM shipments WHERE status = 'Delivered'")
        delivered_shipments = cursor.fetchone()[0]
        
        # Lost/Damaged shipments
        cursor.execute("""
            SELECT COUNT(*) FROM shipments 
            WHERE status IN ('Lost', 'Damaged')
        """)
        problem_shipments = cursor.fetchone()[0]
        
        # Total locations
        cursor.execute("SELECT COUNT(*) FROM locations")
        total_locations = cursor.fetchone()[0]
        
        # Total users
        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]
        
        # Events logged today
        cursor.execute("""
            SELECT COUNT(*) FROM shipment_events 
            WHERE DATE(created_at) = CURRENT_DATE
        """)
        events_today = cursor.fetchone()[0]
        
        # Calculate delivery rate
        delivery_rate = (delivered_shipments / total_shipments * 100) if total_shipments > 0 else 0
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": {
                "total_shipments": total_shipments,
                "active_shipments": active_shipments,
                "delivered_shipments": delivered_shipments,
                "problem_shipments": problem_shipments,
                "total_locations": total_locations,
                "total_users": total_users,
                "events_today": events_today,
                "delivery_rate": round(delivery_rate, 1)
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/dashboard/status-distribution", methods=["GET"])
def get_status_distribution():
    """Get shipment count by status"""
    try:
        connection = db_connection()
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT status, COUNT(*) as count
            FROM shipments
            GROUP BY status
            ORDER BY count DESC
        """)
        
        results = cursor.fetchall()
        
        distribution = [
            {"status": row[0] or "Unknown", "count": row[1]}
            for row in results
        ]
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": distribution
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/dashboard/recent-activity", methods=["GET"])
def get_recent_activity():
    """Get recent shipment events"""
    try:
        limit = request.args.get("limit", 10, type=int)
        
        connection = db_connection()
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT 
                se.id,
                se.tracking_code,
                se.status,
                se.created_at,
                se.notes,
                u.name as user_name,
                l.name as location_name
            FROM shipment_events se
            LEFT JOIN users u ON se.recorded_by = u.id
            LEFT JOIN locations l ON se.location_id = l.id
            ORDER BY se.created_at DESC
            LIMIT %s
        """, (limit,))
        
        results = cursor.fetchall()
        
        activities = [
            {
                "id": str(row[0]),
                "tracking_code": row[1],
                "status": row[2],
                "created_at": row[3].isoformat() if row[3] else None,
                "notes": row[4],
                "user_name": row[5],
                "location_name": row[6]
            }
            for row in results
        ]
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": activities
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# =====================================================
# SHIPMENTS
# =====================================================

@app.route("/api/shipments", methods=["GET"])
def get_shipments():
    """Get all shipments with optional filtering"""
    try:
        # Query parameters for filtering
        status = request.args.get("status")
        origin_id = request.args.get("origin_id")
        destination_id = request.args.get("destination_id")
        limit = request.args.get("limit", 50, type=int)
        offset = request.args.get("offset", 0, type=int)
        
        connection = db_connection()
        cursor = connection.cursor()
        
        # Build query
        query = """
            SELECT 
                s.id,
                s.tracking_code,
                s.status,
                s.description,
                s.created_at,
                s.last_update,
                lo.name as origin_name,
                lo.type as origin_type,
                ld.name as destination_name,
                ld.type as destination_type
            FROM shipments s
            LEFT JOIN locations lo ON s.origin_id = lo.id
            LEFT JOIN locations ld ON s.destination_id = ld.id
            WHERE 1=1
        """
        
        params = []
        
        if status:
            query += " AND s.status = %s"
            params.append(status)
        
        if origin_id:
            query += " AND s.origin_id = %s"
            params.append(origin_id)
        
        if destination_id:
            query += " AND s.destination_id = %s"
            params.append(destination_id)
        
        query += " ORDER BY s.last_update DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        # Get total count
        count_query = "SELECT COUNT(*) FROM shipments WHERE 1=1"
        count_params = []
        
        if status:
            count_query += " AND status = %s"
            count_params.append(status)
        
        cursor.execute(count_query, count_params)
        total_count = cursor.fetchone()[0]
        
        shipments = [
            {
                "id": str(row[0]),
                "tracking_code": row[1],
                "status": row[2],
                "description": row[3],
                "created_at": row[4].isoformat() if row[4] else None,
                "last_update": row[5].isoformat() if row[5] else None,
                "origin": {
                    "name": row[6],
                    "type": row[7]
                },
                "destination": {
                    "name": row[8],
                    "type": row[9]
                }
            }
            for row in results
        ]
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": shipments,
            "pagination": {
                "total": total_count,
                "limit": limit,
                "offset": offset,
                "has_more": (offset + limit) < total_count
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/shipments/<tracking_code>", methods=["GET"])
def get_shipment_detail(tracking_code):
    """Get detailed information about a specific shipment"""
    try:
        connection = db_connection()
        cursor = connection.cursor()
        
        # Get shipment details
        cursor.execute("""
            SELECT 
                s.id,
                s.tracking_code,
                s.status,
                s.description,
                s.created_at,
                s.last_update,
                lo.id as origin_id,
                lo.name as origin_name,
                lo.type as origin_type,
                lo.latitude as origin_lat,
                lo.longitude as origin_lon,
                lo.region as origin_region,
                ld.id as destination_id,
                ld.name as destination_name,
                ld.type as destination_type,
                ld.latitude as destination_lat,
                ld.longitude as destination_lon,
                ld.region as destination_region
            FROM shipments s
            LEFT JOIN locations lo ON s.origin_id = lo.id
            LEFT JOIN locations ld ON s.destination_id = ld.id
            WHERE s.tracking_code = %s
        """, (tracking_code,))
        
        shipment_row = cursor.fetchone()
        
        if not shipment_row:
            return jsonify({"success": False, "error": "Shipment not found"}), 404
        
        # Get event history
        cursor.execute("""
            SELECT 
                se.id,
                se.status,
                se.created_at,
                se.notes,
                u.name as user_name,
                u.title as user_title,
                l.name as location_name,
                l.type as location_type
            FROM shipment_events se
            LEFT JOIN users u ON se.recorded_by = u.id
            LEFT JOIN locations l ON se.location_id = l.id
            WHERE se.tracking_code = %s
            ORDER BY se.created_at DESC
        """, (tracking_code,))
        
        events = cursor.fetchall()
        
        shipment = {
            "id": str(shipment_row[0]),
            "tracking_code": shipment_row[1],
            "status": shipment_row[2],
            "description": shipment_row[3],
            "created_at": shipment_row[4].isoformat() if shipment_row[4] else None,
            "last_update": shipment_row[5].isoformat() if shipment_row[5] else None,
            "origin": {
                "id": str(shipment_row[6]),
                "name": shipment_row[7],
                "type": shipment_row[8],
                "latitude": float(shipment_row[9]) if shipment_row[9] else None,
                "longitude": float(shipment_row[10]) if shipment_row[10] else None,
                "region": shipment_row[11]
            },
            "destination": {
                "id": str(shipment_row[12]),
                "name": shipment_row[13],
                "type": shipment_row[14],
                "latitude": float(shipment_row[15]) if shipment_row[15] else None,
                "longitude": float(shipment_row[16]) if shipment_row[16] else None,
                "region": shipment_row[17]
            },
            "events": [
                {
                    "id": str(event[0]),
                    "status": event[1],
                    "created_at": event[2].isoformat() if event[2] else None,
                    "notes": event[3],
                    "user": {
                        "name": event[4],
                        "title": event[5]
                    },
                    "location": {
                        "name": event[6],
                        "type": event[7]
                    }
                }
                for event in events
            ]
        }
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": shipment
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/shipments", methods=["POST"])
def create_shipment():
    """Create a new shipment"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["tracking_code", "origin_id", "destination_id"]
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400
        
        connection = db_connection()
        cursor = connection.cursor()
        
        cursor.execute("""
            INSERT INTO shipments (tracking_code, origin_id, destination_id, status, description)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, tracking_code, created_at
        """, (
            data["tracking_code"],
            data["origin_id"],
            data["destination_id"],
            data.get("status", "pending"),
            data.get("description")
        ))
        
        result = cursor.fetchone()
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": {
                "id": str(result[0]),
                "tracking_code": result[1],
                "created_at": result[2].isoformat()
            }
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# =====================================================
# LOCATIONS
# =====================================================

@app.route("/api/locations", methods=["GET"])
def get_locations():
    """Get all locations"""
    try:
        location_type = request.args.get("type")
        
        connection = db_connection()
        cursor = connection.cursor()
        
        query = """
            SELECT id, name, type, latitude, longitude, region, created_at
            FROM locations
            WHERE 1=1
        """
        params = []
        
        if location_type:
            query += " AND type = %s"
            params.append(location_type)
        
        query += " ORDER BY name"
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        locations = [
            {
                "id": str(row[0]),
                "name": row[1],
                "type": row[2],
                "latitude": float(row[3]) if row[3] else None,
                "longitude": float(row[4]) if row[4] else None,
                "region": row[5],
                "created_at": row[6].isoformat() if row[6] else None
            }
            for row in results
        ]
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": locations
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/locations/<location_id>/activity", methods=["GET"])
def get_location_activity(location_id):
    """Get activity statistics for a specific location"""
    try:
        connection = db_connection()
        cursor = connection.cursor()
        
        # Get location details
        cursor.execute("""
            SELECT id, name, type, region
            FROM locations
            WHERE id = %s
        """, (location_id,))
        
        location = cursor.fetchone()
        
        if not location:
            return jsonify({"success": False, "error": "Location not found"}), 404
        
        # Shipments originating from this location
        cursor.execute("""
            SELECT COUNT(*) FROM shipments WHERE origin_id = %s
        """, (location_id,))
        origin_count = cursor.fetchone()[0]
        
        # Shipments destined for this location
        cursor.execute("""
            SELECT COUNT(*) FROM shipments WHERE destination_id = %s
        """, (location_id,))
        destination_count = cursor.fetchone()[0]
        
        # Events logged at this location
        cursor.execute("""
            SELECT COUNT(*) FROM shipment_events WHERE location_id = %s
        """, (location_id,))
        events_count = cursor.fetchone()[0]
        
        # Users at this location
        cursor.execute("""
            SELECT COUNT(*) FROM users WHERE location_id = %s
        """, (location_id,))
        users_count = cursor.fetchone()[0]
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": {
                "location": {
                    "id": str(location[0]),
                    "name": location[1],
                    "type": location[2],
                    "region": location[3]
                },
                "statistics": {
                    "shipments_originated": origin_count,
                    "shipments_received": destination_count,
                    "events_logged": events_count,
                    "users_count": users_count
                }
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# =====================================================
# USERS
# =====================================================

@app.route("/api/users", methods=["GET"])
def get_users():
    """Get all users"""
    try:
        title = request.args.get("title")  # Filter by role (admin/field)
        
        connection = db_connection()
        cursor = connection.cursor()
        
        query = """
            SELECT 
                u.id,
                u.name,
                u.phone_number,
                u.id_number,
                u.title,
                u.created_at,
                l.name as location_name,
                l.type as location_type
            FROM users u
            LEFT JOIN locations l ON u.location_id = l.id
            WHERE 1=1
        """
        params = []
        
        if title:
            query += " AND u.title = %s"
            params.append(title)
        
        query += " ORDER BY u.name"
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        users = [
            {
                "id": str(row[0]),
                "name": row[1],
                "phone_number": row[2],
                "id_number": row[3],
                "title": row[4],
                "created_at": row[5].isoformat() if row[5] else None,
                "location": {
                    "name": row[6],
                    "type": row[7]
                }
            }
            for row in results
        ]
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": users
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/users/<user_id>/activity", methods=["GET"])
def get_user_activity(user_id):
    """Get activity history for a specific user"""
    try:
        connection = db_connection()
        cursor = connection.cursor()
        
        # Get user details
        cursor.execute("""
            SELECT u.id, u.name, u.title, l.name as location_name
            FROM users u
            LEFT JOIN locations l ON u.location_id = l.id
            WHERE u.id = %s
        """, (user_id,))
        
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"success": False, "error": "User not found"}), 404
        
        # Get events logged by this user
        cursor.execute("""
            SELECT 
                se.id,
                se.tracking_code,
                se.status,
                se.created_at,
                se.notes,
                l.name as location_name
            FROM shipment_events se
            LEFT JOIN locations l ON se.location_id = l.id
            WHERE se.recorded_by = %s
            ORDER BY se.created_at DESC
            LIMIT 50
        """, (user_id,))
        
        events = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": {
                "user": {
                    "id": str(user[0]),
                    "name": user[1],
                    "title": user[2],
                    "location_name": user[3]
                },
                "events": [
                    {
                        "id": str(event[0]),
                        "tracking_code": event[1],
                        "status": event[2],
                        "created_at": event[3].isoformat() if event[3] else None,
                        "notes": event[4],
                        "location_name": event[5]
                    }
                    for event in events
                ]
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# =====================================================
# ANALYTICS
# =====================================================

@app.route("/api/analytics/timeline", methods=["GET"])
def get_shipments_timeline():
    """Get shipment creation timeline (last 30 days)"""
    try:
        days = request.args.get("days", 30, type=int)
        
        connection = db_connection()
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count
            FROM shipments
            WHERE created_at >= NOW() - INTERVAL '%s days'
            GROUP BY DATE(created_at)
            ORDER BY date
        """, (days,))
        
        results = cursor.fetchall()
        
        timeline = [
            {
                "date": row[0].isoformat() if row[0] else None,
                "count": row[1]
            }
            for row in results
        ]
        
        cursor.close()
        connection.close()
        
        return jsonify({
            "success": True,
            "data": timeline
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Run on different port from USSD app
