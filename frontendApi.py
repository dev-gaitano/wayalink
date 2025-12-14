# create typscript interface with DB structure
from flask import Flask
from databaseConnection import db_connection
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# fetch that data from DB using python
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
    cursor.execute("""SELECT SUM(EXTRACT(EPOCH FROM s.actual_delivery - s.created_at) / 3600) AS total_hours
                   FROM shipments s
                   JOIN (
                       SELECT DISTINCT ON (tracking_code) tracking_code, status
                       FROM shipment_events
                       ORDER BY tracking_code, created_at DESC
                   ) latest_statuses
                   ON s.tracking_code = latest_statuses.tracking_code
                   WHERE latest_statuses.status = 'delivered';""")

    sum_of_delivery_hours = int(cursor.fetchone()[0])

    # count of all delivered shipments
    total_delivered_shipments = all_status_counts.get("delivered", 0)

    # Divide sum by count
    avg_delivery_hours = sum_of_delivery_hours / total_delivered_shipments
        
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


@app.route("/api/details/shipments", methods=["GET"])
def shipments():
    conn = db_connection()
    cursor = conn.cursor()

    # Fetch total shipments
    cursor.execute("SELECT COUNT(*) FROM shipments")
    rows = cursor.fetchone()
    total_shipments = rows[0] if rows else 0
        
    cursor.close()
    conn.close()

    # Store data in a variable shipments
    shipments_data = {
            "total_shipments" : total_shipments,
            }

    # export data
    return shipments_data


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
