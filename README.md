# Local Problem Map (CityFix)

A smart city web application that allows citizens to report local problems directly on an interactive map.  
Users can mark issues like potholes, garbage, water leakage, streetlight failures, and more with exact location details.

## Features

- Interactive map using Leaflet.js
- Report local civic problems with exact location
- Category-based issue reporting
- Real-time marker placement on map
- Backend API with Express.js
- MongoDB database integration
- Responsive UI

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- Leaflet.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```bash
local-problem-map/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── routes/
│
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone <your-repository-link>
cd local-problem-map
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Start MongoDB

Make sure MongoDB is installed and running locally.

Default connection:
```bash
mongodb://127.0.0.1:27017/cityfix
```

### 4. Run Backend Server

```bash
npm start
```

### 5. Run Frontend

Open `frontend/index.html` in your browser.

## How It Works

1. User opens the map.
2. User clicks on a location.
3. A report form appears.
4. User submits the issue details.
5. The issue is stored in MongoDB.
6. A marker appears on the map.

## Future Improvements

- User authentication
- Admin dashboard
- Status tracking (Pending / In Progress / Resolved)
- Image upload support
- Notification system
- Mobile app version

## Use Cases

- Smart City Management
- Municipal Complaint Tracking
- Community Problem Reporting
- Civic Engagement Platforms

## Author

Developed by Nikunj Karena
