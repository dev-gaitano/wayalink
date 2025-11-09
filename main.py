from flask import Flask, request, Response
import africastalking
import psycopg2

USERNAME = "sandbox"
API_KEY = "atsk_2e05fc2a2455066c623e6007db868e0a80ab0050658bee12b2118eabc8c125de8f7cd415"
africastalking.initialize(USERNAME, API_KEY)

app = Flask(__name__)

def db_connection():
    return psycopg2.connect(host="localhost", dbname="wayalink",
                              user="gaitano", password="1337", port=5432)

@app.route("/ussd", methods=["POST"])
def ussd() -> Response:
    connection = db_connection()
    cursor = connection.cursor()

    session_id = request.form.get("sessionId")
    service_code = request.form.get("serviceCode")
    phone_number = request.form.get("phoneNumber")
    # get user_id tied to the phone phone_number from users table
    # get location_id
    # get timestamp (current time)
    text = request.form.get("text")

    # USSD logic
    if text == "":
        response = "CON Welcome to WayaLink\n"
        response += "1. Log Shipment\n"
        response += "2. Track Shipment"
    elif text == "1":
        # request shipment_id
        response = "CON Enter shipment ID"
        # request shipment status
        # request notes (if Any)
        # check if shipment exists in shipments table
        # store data in shipment_events table
        #   - user_id
        #   - shipment_id
        #   - location_id
        #   - timestamp
        #   - status
        #   - notes (if any)
    elif text == "2":
        # request shipment_id
        response = "CON Enter shipment ID"
        # check if shipment exists in shipments table
        # return shipment data from shipments table
        #   - location_name
        #   - status

    else:
        response = "END Invalid option"

    connection.commit()
    cursor.close()
    connection.close()

    return Response(response, mimetype="text/plain")

if __name__ == '__main__':
    app.run(debug=True)
