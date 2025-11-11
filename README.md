<div align="center">
    <img src="https://res.cloudinary.com/diwkfbsgv/image/upload/v1762788273/banner_roudux.png" alt="banner_img">
</div>

<a id="readme-top"></a>

<br />
<br />

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <a href="#project-demo">About The Project</a>
      <ul>
        <li><a href="#project-structure">Project Structure</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

WayaLink is a dual-interface logistics tracking system designed to improve end-to-end product visibility in fragmented supply chains. Built specifically for regions with low technology adoption, WayaLink combines:

1. **USSD Interface for field workers:** Works on any mobile phone (including feature phones) without requiring internet connectivity
2. **Web Dashboard for managers & admins:** Provides analytics, reporting, and system management capabilities

### Key Features

- 📱 **Universal Access**: Works on any phone via USSD (no smartphone required)
- 🌐 **Offline-First**: Functions without internet connectivity
- 📦 **Real-time Tracking**: Track shipments at every supply chain point
- 👥 **Built-in Accountability**: Every action tied to a user and location
- 📝 **Complete Audit Trail**: Immutable event log for all status changes
- 📊 Admin Dashboard: Web-based UI for analytics and management

### Project Demo

![Demo][demo]

### Project Structure

```
wayalink/
├── .git/                   # Git repository data
├── .gitignore              # Git ignore rules
├── database.sql            # Database schema creation script
├── database_connection.py  # Database connection configuration
├── main.py                 # Main Flask application
├── seed_data.py            # Database seeding script
├── requirements.txt        # Python dependencies
└── README.md               # Project documentation
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to set up WayaLink locally.

### Prerequisites

Ensure you have the following installed:

- **Python 3.8+**
- **pip** (Python package installer)
- **PostgreSQL 12+**
- **ngrok** (for USSD webhook tunneling)
- **Africa's Talking Account** (for USSD gateway)

### Installation

#### Step 1: Clone the Repository

```sh
git clone git@github.com:dev-gaitano/wayalink.git
cd wayalink
```

#### Step 2: Set Up Virtual Environment

```sh
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Step 3: Install Dependencies

```sh
pip install -r requirements.txt
```

#### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```sh
touch .env
```

Add the following configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_NAME=wayalink
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Africa's Talking Credentials
AT_USERNAME=sandbox  # Use 'sandbox' for testing, your username for production
AT_API_KEY=your_africastalking_api_key
```

**Note**: Get your Africa's Talking credentials from [https://africastalking.com/](https://africastalking.com/)

#### Step 5: Set Up PostgreSQL Database

Create the database:

```sh
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE wayalink;

# Exit PostgreSQL
\q
```

Run the database schema script:

```sh
psql -U your_postgres_username -d wayalink -f database.sql
```

#### Step 6: Seed the Database

Populate the database with test data:

```sh
python3 seed_data.py
```

This will create:

- 7 locations (manufacturers, warehouses, retailers)
- 26 test users
- 20 sample shipments

#### Step 7: Start the Flask Application

```sh
python3 main.py
```

The application will start on `http://localhost:5000`

#### Step 8: Expose Local Server with ngrok

In a new terminal window:

```sh
ngrok http 5000
```

Copy the HTTPS forwarding URL (e.g., `https://abc123.ngrok.io`)

#### Step 9: Configure Africa's Talking Webhook

1. Log in to your [Africa's Talking account](https://account.africastalking.com/)
2. Navigate to **USSD** → **Create Channel**
3. Set the **Callback URL** to: `https://your-ngrok-url.ngrok.io/ussd`
4. Note your **USSD code** (e.g., `*384*96#`)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE -->

## Usage

### Testing the USSD Interface

#### Option 1: Using Africa's Talking Simulator

1. Go to your Africa's Talking dashboard
2. Navigate to **Launch Simulator**
3. Enter a test phone number from the seeded data (e.g., `+254712345678`)
4. Dial your USSD code

#### Option 2: Using a Real Phone (Production)

1. Dial your USSD code (e.g., `*384*96#`)
2. Follow the menu prompts

### USSD Menu Flow

#### Main Menu

```
Welcome to WayaLink
1. Log Shipment
2. Track Shipment
0. Exit
```

#### Log Shipment Flow

1. Select option `1`
2. Enter tracking code (e.g., `WL-2025-001`)
3. Select status:
   - 1: Picked Up
   - 2: In Transit
   - 3: Delivered
   - 4: Damaged
   - 5: Lost
4. Add optional notes or press `0` to skip
5. Confirmation message appears

#### Track Shipment Flow

1. Select option `2`
2. Enter tracking code (e.g., `WL-2025-001`)
3. View shipment details:
   - Origin location
   - Destination location
   - Current status

### Test Data

**Sample Tracking Codes**:

- `WL-2025-001` to `WL-2025-020`

**Sample Phone Numbers** (for authentication):

- `+254712345678` (John Kamau - Admin at Kikuyu Textiles)
- `+254723456789` (Mary Wanjiku - Field at Kikuyu Textiles)
- `+254756789012` (David Mwangi - Admin at Nairobi Central Warehouse)

**Sample Locations**:

- Kikuyu Textiles Ltd (Manufacturer - Kiambu)
- Nairobi Central Warehouse (Warehouse - Nairobi)
- Eldoret Retail Hub (Retailer - Uasin Gishu)

### Database Queries

Check shipments and events:

```sql
-- View all shipments
SELECT * FROM shipments;

-- View all events for a specific shipment
SELECT * FROM shipment_events WHERE tracking_code = 'WL-2025-001';

-- View user activity
SELECT u.name, l.name as location, COUNT(se.id) as events_logged
FROM users u
LEFT JOIN locations l ON u.location_id = l.id
LEFT JOIN shipment_events se ON u.id = se.recorded_by
GROUP BY u.name, l.name;
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TROUBLESHOOTING -->

## Troubleshooting

### Common Issues

**1. Database Connection Error**

```
Error: FATAL: database "wayalink" does not exist
```

**Solution**: Create the database first:

```sh
psql -U postgres -c "CREATE DATABASE wayalink;"
```

**2. Africa's Talking Webhook Error**

```
Error: User not registered. Please contact support.
```

**Solution**: Ensure the phone number exists in the `users` table. Use one of the seeded phone numbers.

**3. ngrok Session Expired**
**Solution**: Restart ngrok and update the Africa's Talking webhook URL with the new ngrok URL.

**4. Import Error for psycopg2**

```
Error: No module named 'psycopg2'
```

**Solution**: Install PostgreSQL development libraries:

```sh
# Ubuntu/Debian
sudo apt-get install libpq-dev

# macOS
brew install postgresql

# Then reinstall
pip install psycopg2
```

**5. Port Already in Use**

```
Error: Address already in use
```

**Solution**: Change the Flask port in `main.py`:

```python
app.run(debug=True, port=5001)
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DEVELOPMENT -->

## Development

### Project Architecture

**Frontend**: React JS
**Backend**: Python Flask  
**Database**: PostgreSQL  
**USSD Gateway**: Africa's Talking  
**Authentication**: Phone number-based

### Database Schema

<div align="center">
    <img src="https://res.cloudinary.com/diwkfbsgv/image/upload/v1762835675/database_design_ss2cxw.png" alt="banner_img">
</div>

- **locations**: Physical supply chain nodes
- **users**: Registered workers tied to locations
- **shipments**: Master tracking records
- **shipment_events**: Immutable audit log

### Adding New Features

1. **Add New Status Options**: Update the `status_map` dictionary in `main.py`
2. **Add New Locations**: Insert into `locations` table
3. **Register New Users**: Insert into `users` table with phone number and location

### Running Tests

```sh
# Run the Flask app in debug mode
python3 main.py

# Use the Africa's Talking USSD simulator
# Test all menu flows
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

This project is part of the WUD Africa AI Hackathon 2025.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

**Eugene Gaitano** - eugenecampbellgaitano@gmail.com  
**Ian Njenga** - iank.njenga@gmail.com  
**Nurhan Garang** - garangnurhan57@gmail.com

**Project Link**: [https://github.com/dev-gaitano/wayalink](https://github.com/dev-gaitano/wayalink)

<br />
<br />

<div align="center">
    <a href="#readme-top">back to top</a>
</div>


[demo]: media/demo.mp4
