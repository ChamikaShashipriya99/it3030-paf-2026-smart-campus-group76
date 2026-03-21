# Smart Campus Operations Hub

## Assignment 2026 - Programming Applications and Frameworks (IT3030)

This repository contains the complete production-inspired web platform for the Smart Campus Operations Hub, developed as part of the IT3030 Assignment.

### 🌟 Core Modules Implemented
- **Module A: Facilities & Assets Catalogue** - Maintain and search active university resources.
- **Module B: Booking Management** - Users can request bookings with conflict-free overlap checking, and Admins can approve/reject workflows. 
- **Module C: Maintenance & Incident Ticketing** - Users can report issues, upload up to 3 image attachments as evidence, and Technicians can claim/resolve the tickets. Complete with an interactive comment thread.
- **Module D: Notifications** - A persistent internal DB notification Inbox with unread counters to alert users of ticket status changes, new comments, or booking outcomes.
- **Module E: Authentication** - Implements strict JWT token-based state, integrated with Google OAuth 2.0 Sign-In, utilizing robust `USER`, `TECHNICIAN`, and `ADMIN` roles.

### 🛠 Tech Stack
- **Backend:** Java, Spring Boot 3, Spring Data JPA, Spring Security, MySQL
- **Frontend:** React.js 18, Vite, React Router DOM, Axios
- **Version Control & CI:** Git, GitHub Actions

## 🚀 Setup Instructions

### 1. Database Initialization
1. Ensure your local **MySQL server** is running.
2. Open your MySQL client and run:  
   `CREATE DATABASE smartcampus;`
3. The application will automatically construct the required schema via Hibernate upon startup.
4. *Note:* Default credentials in `application.properties` are set as `root` with no password. Change these if your local setup differs.

### 2. Running the Backend (Spring Boot REST API)
1. Open a terminal and navigate to the `backend` directory.
2. Execute the Maven wrapper command:  
   `mvn spring-boot:run`
3. The API will start functioning on port `8080`.

### 3. Running the Frontend (React Client)
1. Open a new terminal and navigate to the `frontend` directory.
2. Install the necessary Node.js dependencies:  
   `npm install`
3. Start the Vite development server:  
   `npm run dev`
4. The web UI will be accessible locally at `http://localhost:5173`.

### 4. Demonstrating Authentication
The system uses Google OAuth2. Ensure you have an active network connection. Role elevations (e.g., standard users becoming `ROLE_ADMIN` or `ROLE_TECHNICIAN`) are governed via internal database checks managed by the system upon the first login.
