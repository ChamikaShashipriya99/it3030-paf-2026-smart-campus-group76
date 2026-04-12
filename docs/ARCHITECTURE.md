# Smart Campus Operations Hub - Architecture Documentation 🏛️

This document outlines the technical architecture of the SmartCampus platform, fulfilling the core documentation requirements for the **IT3030 PAF Assignment**.

---

## 1. System Architecture (High-Level)
The system follows a classic **Client-Server** architecture optimized for cloud scalability.

```mermaid
graph LR
    subgraph "User Tier"
        Client["React Web Client (Vite)"]
    end

    subgraph "Logic Tier (Spring Boot 3.4)"
        Auth["Spring Security / OAuth2"]
        API["REST Controllers"]
        Service["Business Logic Services"]
    end

    subgraph "Data Tier"
        DB[("MongoDB Atlas (NoSQL)")]
    end

    Client -- "HTTPS / JWT" --> Auth
    Auth --> API
    API --> Service
    Service -- "Aggregation / CRUD" --> DB
    Client -- "SSO Handshake" --> Google["Google Identity Provider"]
    Auth -- "Token Verification" --> Google
```

---

## 2. Backend Layered Architecture
The Spring Boot backend is structured using a strict **Layered Pattern** to ensure separation of concerns and maintainability.

```mermaid
graph TD
    subgraph "Request / Response Layer"
        C["Controllers (@RestController)"]
    end

    subgraph "Business Logic Layer"
        S["Services (@Service)"]
        V["Validation (Jakarta)"]
    end

    subgraph "Persistence Layer"
        R["Repositories (MongoRepository)"]
        M["Models (@Document)"]
    end

    C <--> V
    V --> S
    S <--> R
    R <--> M
```

---

## 3. Frontend Component Architecture
The React application is built on a **Modular Hook-based** architecture, leveraging Context API for global state management.

```mermaid
graph TD
    subgraph "Global State (Context)"
        AuthCtx["AuthContext (User Session)"]
        NotifCtx["NotificationContext (Global Toasts)"]
    end

    subgraph "Routing Tier"
        App["App.jsx (React Router)"]
        Priv["PrivateRoute (Guard)"]
    end

    subgraph "Presentation Tier"
        Pages["Pages (Dashboard, Catalogue, etc.)"]
        Comps["Reusable UI Components (Navbar, Cards)"]
    end

    subgraph "Data Access"
        Axios["Axios Config (JWT Interceptor)"]
    end

    App --> Priv
    Priv --> Pages
    Pages --> Comps
    Pages --> Axios
    AuthCtx -.-> Priv
    NotifCtx -.-> Pages
```

---

## 4. Key Performance & Security Decisions
*   **JWT Authentication**: Stateless authentication using secure local storage tokens for API authorization.
*   **NoSQL Flexibility**: MongoDB was chosen to handle the semi-structured nature of "Incident Reports" and "Resource Metadata".
*   **Pristine Tech Design System**: Custom Vanilla CSS tokens used instead of bloated frameworks to ensure sub-second rendering and a premium, geometric aesthetic.
