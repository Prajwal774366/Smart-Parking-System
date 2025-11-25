🚗 SMART PARKING SYSTEM
A Multi-Floor Automated Parking Management Solution
⭐ Overview

The Smart Parking System is a full-stack Java application built to streamline real-world parking lot operations.
It supports multi-floor parking, real-time slot availability tracking, admin authentication, billing automation, and printable parking tickets — all wrapped in a modern, gradient UI.

This project demonstrates strong skills in backend engineering, frontend development, REST APIs, state management, data validation, UI/UX design, and full-stack system architecture — making it an excellent industry-ready portfolio project.

🚀 Key Features
🔐 Admin Portal

Secure registration and login

Input validation (string-only username, mixed password)

Only authenticated admins can manage parking

🅿️ Multi-Floor Parking Management

Supports 7 floors:

🅶 Ground

🅵1 First Floor

🅵2 Second Floor

🅵3 Third Floor

🅵4 Fourth Floor

🅱1 Basement 1

🅱2 Basement 2

Each floor contains 100 slots → Total 700 slots.

🚘 Smart Parking

Select floor → Auto-load free slots

Vehicle number validation (mandatory alphanumeric, min length)

Real-time occupancy update

Prevents double parking and invalid slot access

⛔ Smart Unparking

Floor-wise slot selector

Auto-calculated:

Entry time

Exit time

Duration

Billable hours

Total amount

Downloadable parking ticket

🎨 Modern UI (Frontend)

Neon + gradient theme

Card-based layout

Animated buttons

Clean tables with hover effects

Fully responsive

🏗️ System Architecture
┌──────────────────────────────────────────────┐
│                  FRONTEND                    │
│  HTML • CSS • JavaScript (Vanilla)           │
│  - Admin Login/Register                      │
│  - Parking Dashboard                         │
│  - Floor + Slot Selection                    │
│  - Realtime Updates & Ticket Print           │
└──────────────────────────────────────────────┘
                    │ REST API JSON
                    ▼
┌──────────────────────────────────────────────┐
│                  BACKEND                     │
│          Java • Spring Boot • Maven          │
│  - Authentication Service                    │
│  - Floor/Slot State Manager                  │
│  - Billing Engine                            │
│  - Parking/Unparking Controller              │
└──────────────────────────────────────────────┘

🛠 Tech Stack
Backend

Java 17

Spring Boot

Maven

Frontend

HTML

CSS

JavaScript

Tools

Git + GitHub

VS Code

Postman (API testing)

📁 Project Structure
smart-parking-system/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── model/
│   ├── dto/
│   └── resources/
│
├── frontend/
│   ├── admin.html
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
└── README.md

🎯 Why This Project Stands Out
✔ Industry-style multi-module architecture
✔ Real REST API backend + dynamic frontend
✔ Authentication + state management
✔ Multi-level parking logic (700 slots total)
✔ Real billing engine
✔ Modern animated UI
✔ Clean code + scalable design
✔ Perfect for resumes, internships, and placements
Prajwal S
Full Stack Developer
GitHub: https://github.com/Prajwal774366

⭐ If you found this project useful

Please star the repository — it motivates further improvements!
