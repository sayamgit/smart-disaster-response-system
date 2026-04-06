# Smart Disaster Response & Prediction System 🌍⚡

A complete **Cloud-Native DevOps Web Application** built for real-time disaster preparedness, predictive analysis, and emergency response coordination. This platform integrates modern visual telemetry, interactive tactical map systems, and resource management pipelines natively packaged through Docker.

## 🚀 Key Features

*   **Interactive Tactical Mapping:** Custom Light/Dark-mode aware cartography using `react-leaflet`, visualizing real-time incidents, predicted risk zones, and geographical safety perimeters.
*   **Predictive AI Telemetry:** Analytical dashboards displaying aggregated disaster predictions and severity matrices to coordinate proactive disaster mitigation.
*   **Role-Based Access Control:** Distinct workflows for Admins (Global View), Volunteers (Task assignments), and Citizens (Local safety insights).
*   **Resource & Volunteer Management:** Real-time logistics tracking for rapid allocation of relief materials and human capital matching.
*   **Cloud-Native & Dockerized:** The entire unified application (Frontend, Backend, and Database cache) is engineered using microservice paradigms for scalable orchestration and deployment.

## 🛠️ Tech Stack & Architecture

### **Frontend Interface**
*   **Framework:** React 18
*   **Styling Engine:** Custom Tailwind CSS (Premium glassmorphism & robust Dark Mode logic)
*   **Mapping:** Leaflet (`react-leaflet`) with tactical telemetry styling
*   **State & Routing:** Context APIs & React Router

### **Backend Service**
*   **Framework:** Node.js with Express.js
*   **Architecture:** RESTful Microservices logic module
*   **Database:** PostgreSQL (with potential container caching bridges via Redis)

### **DevOps & Infrastructure**
*   **Containerization:** Fully structured `docker-compose` topology.
*   **Deployment Target:** Automated Infrastructure-as-Code via **Render.com**.

## 💻 Local Development Setup

To spin up the entire application locally for testing:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/sayamgit/smart-disaster-response-system.git
   cd smart-disaster-response-system
   ```

2. **Configure Environment:**
   Create a `.env` file in the `backend/` directory referencing `.env.example`.

3. **Deploy via Docker Compose:**
   Our native setup utilizes Docker to ensure the Postgres DB, Express Backend, and React Frontend spin up synchronously in isolated containers.
   ```bash
   cd docker
   docker compose up -d --build
   ```

4. **Access the Interface:**
   The Web UI is now seamlessly running natively on your machine!
   *   **Frontend:** `http://localhost:3000`
   *   **Backend API:** `http://localhost:5000`

---
*Created as an academic Capstone Project focused on Modern Cloud-Native DevOps CI/CD integration and modern UI engineering standards.*
