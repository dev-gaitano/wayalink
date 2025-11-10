import os
from dotenv import load_dotenv
import africastalking
from flask import Flask, request, Response
from database_connection import db_connection
from datetime import datetime

load_dotenv()

USERNAME = os.getenv("AT_USERNAME")
API_KEY = os.getenv("AT_API_KEY")
africastalking.initialize(USERNAME, API_KEY)

app = Flask(__name__)

@app.route("/ussd", methods=["POST"])
def ussd() -> Response:
    connection = db_connection()
    cursor = connection.cursor()

    session_id = request.form.get("sessionId")
    phone_number = request.form.get("phoneNumber")

    # Get user_id and location_id tied to the phone_number from users table
    cursor.execute("SELECT id, location_id FROM users WHERE phone_number = %s", (phone_number,))
    user_data = cursor.fetchone()
    if not user_data:
        response = "END User not registered. Please contact support."
        cursor.close()
        connection.close()
        return Response(response, mimetype="text/plain")

    user_id, user_location_id = user_data

    # get timestamp (current time)
    timestamp = datetime.now()
    text = request.form.get("text", "")

    # USSD logic
    if text == "":
        response = "CON Welcome to WayaLink\n"
        response += "1. Log Shipment\n"
        response += "2. Track Shipment\n"
        response += "0. Exit"

    elif text == "1":
        # request shipment_id
        response = "CON Enter Tracking Code"

    elif text.startswith("1*"):
        parts = text.split("*")
        
        if len(parts) == 2:
            # User entered Tracking Code
            tracking_code = parts[1]
            
            # check if shipment exists in shipments table
            cursor.execute("SELECT tracking_code FROM shipments WHERE tracking_code = %s", (tracking_code,))
            shipment_exists = cursor.fetchone()
            
            if not shipment_exists:
                response = "END Tracking code not found."

            else:
                # request shipment status
                response = "CON Select status:\n"
                response += "1. Picked Up\n"
                response += "2. In Transit\n"
                response += "3. Delivered\n"
                response += "4. Damaged\n"
                response += "5. Lost"
        
        elif len(parts) == 3:
            # User selected status
            tracking_code = parts[1]
            status_option = parts[2]
            
            status_map = {
                "1": "Picked Up",
                "2": "In Transit",
                "3": "Delivered",
                "4": "Damaged",
                "5": "Lost"
            }
            
            status = status_map.get(status_option, "Unknown")
            
            if status == "Unknown":
                response = "END Invalid status option."

            else:
                response = "CON Add notes? (Enter notes or type 0 for none):"
        
        elif len(parts) == 4:
            # User entered notes or skipped
            # request notes (if Any)
            tracking_code = parts[1]
            status_option = parts[2]
            notes_input = parts[3]
            
            status_map = {
                "1": "Picked Up",
                "2": "In Transit",
                "3": "Out for Delivery",
                "4": "Delivered",
                "5": "Delayed",
                "6": "Failed"
            }
            
            status = status_map.get(status_option, "Unknown")
            notes = None if notes_input == "0" else notes_input
            
            # store data in shipment_events table
            #   - session_id
            #   - user_id
            #   - tracking_code
            #   - location_id
            #   - timestamp
            #   - status
            #   - notes (if any)
            cursor.execute("""
                INSERT INTO shipment_events (session_id, tracking_code,
                                             recorded_by, location_id, status,
                                             created_at, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (session_id, tracking_code, user_id, user_location_id, status,
                  timestamp, notes))
            
            # Update shipment status in shipments table
            cursor.execute("""
                UPDATE shipments SET status = %s WHERE tracking_code = %s
            """, (status, tracking_code))
            
            response = f"END Shipment {tracking_code} logged successfully with status: {status}"

        else:
            response = "END Invalid input."

    elif text == "2":
        # request shipment_id
        response = "CON Enter Tracking Code"

    elif text.startswith("2*"):
        parts = text.split("*")
        
        if len(parts) == 2:
            # User entered Tracking Code
            tracking_code = parts[1]

            # Check if shipment exists and get its data
            cursor.execute("""
                SELECT s.status, l_origin.name as origin, l_dest.name as destination
                FROM shipments s
                LEFT JOIN locations l_origin ON s.origin_id = l_origin.id
                LEFT JOIN locations l_dest ON s.destination_id = l_dest.id
                WHERE s.tracking_code = %s
            """, (tracking_code,))
            
            shipment_data = cursor.fetchone()

            if not shipment_data:
                response = "END Tracking code not found."

            else:
                # return shipment data from shipments table
                #   - location_name
                #   - status
                status, origin, destination = shipment_data
                response = f"END Shipment: {tracking_code}\n"
                response += f"Origin: {origin or 'N/A'}\n"
                response += f"Destination: {destination or 'N/A'}\n"
                response += f"Status: {status or 'Unknown'}"

        else:
            response = "END Invalid input."

    elif text == "0":
        response = "END Karibu Tena WayaLink!"

    else:
        response = "END Invalid option"

    connection.commit()
    cursor.close()
    connection.close()

    return Response(response, mimetype="text/plain")

if __name__ == '__main__':
    app.run(debug=True)
