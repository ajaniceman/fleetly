Fleetly
Table of Contents
About Fleetly

Features

Technologies Used

Getting Started

Prerequisites

Backend Setup

Frontend Setup

Running the Application

Project Structure

License

Contributing

Contact

About Fleetly
Fleetly is a comprehensive fleet management application designed to streamline vehicle tracking, maintenance schedules, and critical date reminders. It empowers businesses and individuals to manage their vehicle fleets efficiently, ensuring optimal performance, compliance, and cost savings. With an intuitive dashboard and proactive notification system, Fleetly helps you stay ahead of maintenance needs and regulatory requirements.

Features
Intuitive Dashboard: Get a real-time overview of your entire fleet at a glance, with key metrics and insights.

Vehicle Management: Easily add, edit, and delete vehicle profiles, including type, make, model, year, license plate, VIN, engine details, and registration dates.

Advanced Tracking: Monitor vehicle service history and upcoming maintenance.

Proactive Maintenance: Never miss a service with automated reminders and detailed service history logs. Supports both odometer and engine hours tracking based on vehicle type.

Critical Date Reminders: Stay compliant with timely alerts for registrations, inspections, license renewals, and other important vehicle-related dates.

Cost Optimization: Track expenses and identify areas for savings to improve your fleet’s profitability.

Mobile Accessibility: Manage your fleet on the go with a fully responsive and optimized mobile experience, including scroll-hide navigation.

User Authentication: Secure user registration, login, and email verification.

Multi-language Support: Supports English, Spanish, Bosnian, French, German, Italian, and Polish for a localized user experience.

Theme Toggling: Switch between light and dark modes for personalized viewing comfort.

Technologies Used
Frontend
React: A JavaScript library for building user interfaces.

React Router DOM: For declarative routing in React applications.

React i18next: Internationalization framework for React.

React Icons: Popular icon library (react-icons/fa for Font Awesome).

CSS3: For styling and responsive design.

Backend
Node.js: JavaScript runtime for server-side logic.

Express.js: Fast, unopinionated, minimalist web framework for Node.js.

MySQL2: MySQL client for Node.js with Promises API.

Bcrypt.js: For hashing passwords.

JSON Web Token (JWT): For secure authentication.

Dotenv: To load environment variables from a .env file.

Nodemailer: For sending emails (e.g., email verification, notifications).

Node-Cron: For scheduling automated tasks (e.g., daily date notifications).

Getting Started
Follow these steps to get your Fleetly application up and running locally.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (LTS version recommended)

npm (comes with Node.js)

MySQL Server (or a compatible database like MariaDB)

Backend Setup
Clone the repository:

git clone https://github.com/your-username/fleetly.git
cd fleetly

Navigate to the server directory:

cd server

Install backend dependencies:

npm install

Create a .env file in the server directory and add your environment variables:

DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=fleetly_db
JWT_SECRET=your_jwt_secret_key_here # Use a strong, random string
FRONTEND_URL=http://localhost:3000 # Or your deployed frontend URL
EMAIL_SERVICE_USER=your_email@gmail.com # Your Gmail address for sending emails
EMAIL_SERVICE_PASS=your_gmail_app_password # IMPORTANT: Use an App Password, not your regular password

Gmail App Password: If using Gmail, you'll need to generate an App Password. See Google's documentation.

Set up your MySQL database:

Log in to your MySQL server.

Create the database specified in DB_NAME (e.g., fleetly_db):

CREATE DATABASE fleetly_db;
USE fleetly_db;

Create the necessary tables. Here are the schemas for users, vehicles, services, vehicle_dates, and email_verification_tokens:

-- users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- email_verification_tokens table
CREATE TABLE email_verification_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- vehicles table
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT,
    license_plate VARCHAR(50),
    vin VARCHAR(20) UNIQUE,
    engine VARCHAR(100),
    registration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- services table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    service_date DATE NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    cost DECIMAL(10, 2),
    odometer_reading INT,
    engine_hours DECIMAL(10, 2),
    next_service_odometer INT,
    next_service_hours DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- vehicle_dates table
CREATE TABLE vehicle_dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    date_type VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- notification_log table for cron jobs
CREATE TABLE notification_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_date_id INT NOT NULL,
    notification_type VARCHAR(100) NOT NULL, -- e.g., '15_days_left', '7_days_left', 'due_today', 'expired'
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (vehicle_date_id, notification_type), -- Ensures a notification type is sent only once per date
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_date_id) REFERENCES vehicle_dates(id) ON DELETE CASCADE
);

Frontend Setup
Navigate to the client directory:

cd client

Install frontend dependencies:

npm install

Ensure language files are set up:

Create client/src/locales/bs/translation.json, fr/translation.json, de/translation.json, it/translation.json, and pl/translation.json.

Populate them with translations for all keys found in en/translation.json.

Running the Application
Start the Backend Server
In the server directory, run:

npm start

The server will typically run on http://localhost:5555. Check the console for the exact port.

Start the Frontend Development Server
In the client directory, run:

npm start

The frontend application will typically open in your browser at http://localhost:3000.

Project Structure
fleetly/
├── client/                     # Frontend React application
│   ├── public/                 # Public assets (index.html, manifest.json)
│   ├── src/
│   │   ├── components/         # Reusable React components (NavBar, Hero, VehicleForm, etc.)
│   │   │   ├── DateForm/
│   │   │   ├── Footer/
│   │   │   ├── Hero/
│   │   │   ├── NavBar/
│   │   │   ├── ServiceForm/
│   │   │   ├── Testimonials/
│   │   │   └── ThemeToggleButton/
│   │   ├── contexts/           # React Contexts (e.g., ThemeContext)
│   │   ├── hooks/              # Custom React Hooks (e.g., useAuth)
│   │   ├── locales/            # Translation files for i18next (en, es, bs, fr, de, it, pl)
│   │   │   ├── bs/
│   │   │   ├── de/
│   │   │   ├── en/
│   │   │   ├── es/
│   │   │   ├── fr/
│   │   │   ├── it/
│   │   │   └── pl/
│   │   ├── pages/              # Main application pages (Home, Dashboard, Login, etc.)
│   │   │   ├── Dashboard/
│   │   │   ├── Features/
│   │   │   ├── Home/
│   │   │   ├── NotFound/
│   │   │   ├── VehicleDatesPage/
│   │   │   ├── VehicleServices/
│   │   │   └── VerifyEmailPage/
│   │   ├── App.js              # Main React App component
│   │   ├── index.css           # Global CSS styles and theme variables
│   │   ├── index.js            # React entry point
│   │   └── i18n.js             # i18next configuration
│   └── package.json            # Frontend dependencies
├── server/                     # Backend Node.js/Express.js application
│   ├── config/                 # Database configuration (dbPool.js)
│   ├── middleware/             # Express middleware (auth.js)
│   ├── routes/                 # API routes (authRoutes.js, vehicleRoutes.js, serviceRoutes.js, dateRoutes.js)
│   ├── tasks/                  # Scheduled tasks (checkDateNotifications.js)
│   ├── utils/                  # Utility functions (emailSender.js)
│   ├── .env.example            # Example environment variables
│   ├── server.js               # Main backend server file
│   └── package.json            # Backend dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # This file

License
This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

You are free to:

Share: copy and redistribute the material in any medium or format.

Adapt: remix, transform, and build upon the material for any purpose, even commercially.

Under the following terms:

Attribution: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

ShareAlike: If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

No additional restrictions: You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

For the full text of the license, please see the LICENSE file in the root of this repository.

Contributing
Contributions are welcome! If you find a bug or have an idea for a new feature, please open an issue or submit a pull request.

Contact
For any questions or support, please contact:
Eman
Email: support@fleetly.com (example)