<div align="center">
    <img src="https://res.cloudinary.com/diwkfbsgv/image/upload/v1762788273/banner_roudux.png" alt="banner_img">
</div>

<a id="readme-top"></a>

<br />
<br />

<!-- ABOUT THE PROJECT -->

## About The Project

WayaLink is a dual-interface logistics tracking system designed to improve end-to-end product visibility in fragmented supply chains. Built specifically for regions with low technology adoption, WayaLink combines:

1. **USSD Interface for field workers:** Works on any mobile phone (including feature phones) without requiring internet connectivity
2. **Web Dashboard for managers & admins:** Provides analytics, reporting, and system management capabilities

### Project Demo

![Demo][demo]

Full Demo [Cloudinary](https://res.cloudinary.com/diwkfbsgv/video/upload/v1762944400/demo-cut_knuioh.mp4)

### Project Structure

```
wayalink/
├── .git/                   # Git repository data
├── .gitignore              # Git ignore rules
├── frontend                # Front-end files directory 
├── database.sql            # Database schema creation script
├── databaseConnection.py   # Database connection configuration
├── Dockerfile              # Deployment container
├── frontendApi.py          # Back-end to Front-end data API
├── main.py                 # Main Flask application
├── Procfile                # Railway connection
├── README.md               # Project documentation
├── requirements.txt        # Python dependencies
└── seed_data.py            # Database seeding script
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to set up WayaLink locally and ensure you have the following installed:

- **Python 3.8+**
- **pip** (Python package installer)
- **PostgreSQL 12+**
- **ngrok** (for USSD webhook tunneling)
- **Africa's Talking Account** (for USSD gateway)

### Installation

#### Step 1: Clone the Repository and setup Virtual Environment

```sh
git clone git@github.com:dev-gaitano/wayalink.git
cd wayalink
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Step 2: Install Dependencies

```sh
pip install -r requirements.txt
```

#### Step 3: Configure Environment Variables

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

#### Step 4: Set Up PostgreSQL Database

Create the database:

```sh
# Login to PostgreSQL
psql -U your_postgres_username

# Create database
CREATE DATABASE wayalink;

# Exit PostgreSQL
\q
```

Run the database schema script:

```sh
psql -U your_postgres_username -d wayalink -f database.sql
```

#### Step 5: Seed the Database

Populate the database with test data:

```sh
python3 seed_data.py
```

This will create:

- 7 locations (manufacturers, warehouses, retailers)
- 26 test users
- 20 sample shipments

#### Step 6: Start the Flask Application

```sh
python3 main.py
```

The application will start on `http://localhost:5000`

#### Step 7: Expose Local Server with ngrok

In a new terminal window:

```sh
ngrok http 5000
```

Copy the HTTPS forwarding URL (e.g., `https://abc123.ngrok.io`)

#### Step 8: Configure Africa's Talking Webhook

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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DEVELOPMENT -->

## Development

### Project Architecture

**Frontend**: Typescript  
**Backend**: Python  
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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

This project is part of the WUD Africa AI Hackathon 2025.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contributors

**Eugene Gaitano** - eugenecampbellgaitano@gmail.com  
**Ian Njenga** - iank.njenga@gmail.com  
**Nurhan Garang** - garangnurhan57@gmail.com

<br />
<br />

<div align="center">
    <a href="#readme-top">back to top</a>
</div>


[demo]: media/demo.webp
