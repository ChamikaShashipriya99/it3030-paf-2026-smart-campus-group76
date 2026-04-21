# Member 4: RESTful API Documentation & Constraints

This document outlines the RESTful architecture and endpoint specifications for **Member 4** (Notifications, Role Management, and OAuth Integration) as per the project requirements.

---

## 1. Compliance with the 6 REST Constraints

Member 4's modules are designed to adhere strictly to the foundational constraints of REST architecture:

### 1.1 Client-Server Separation
The **React frontend** and **Spring Boot backend** are fully decoupled. The frontend components (like `ManageUsers.jsx` and `NotificationContext.jsx`) consume Member 4's APIs without any knowledge of the server-side business logic or database structure (MongoDB).

### 1.2 Statelessness
Verified in `SecurityConfig.java`, the system uses `SessionCreationPolicy.STATELESS`. Member 4's endpoints rely on **JWT (JSON Web Tokens)** passed in the `Authorization` header. No session state is stored on the server, ensuring every request is self-contained.

### 1.3 Uniform Interface
Member 4 implements a clean and consistent interface:
*   **Resource Identification**: Unique URIs like `/api/users/{id}` and `/api/notifications/{id}`.
*   **Method Consistency**: Use of standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) to represent actions.
*   **Self-Descriptive**: All responses use standard `application/json` content types and appropriate HTTP status codes (200 OK, 401 Unauthorized, 404 Not Found).

### 1.4 Cacheable
The CORS configuration explicitly allows the `Cache-Control` header. This allows clients to cache frequently accessed but rarely changed data (like user profile meta-data), improving performance and responsiveness.

### 1.5 Layered System
Data flow follows a strict hierarchy: **Security Filter → REST Controller → Service Logic → Data Repository**. The client interacts only with the top "Web" layer, unaware of the internal security handlers or database implementations.

### 1.6 Code on Demand (Optional)
This project follows modern standard practices where no executable scripts are transferred from server to client to ensure maximum security and integrity.

---

## 2. Member 4: API Endpoint Specification

Member 4 has implemented **7 unique endpoints** across 4 different HTTP methods, exceeding the minimum requirement of 4 endpoints.

### Module: Role & Identity Management
| Method | Endpoint | Description | Auth Requirement |
|:---|:---|:---|:---|
| **GET** | `/api/users` | Fetches the full registry of campus members. | `ROLE_ADMIN` |
| **PUT** | `/api/users/{id}/role` | Updates a user's system authority (User, Technician, Admin). | `ROLE_ADMIN` |
| **DELETE** | `/api/users/{id}` | Permanently removes a user identity from the registry. | `ROLE_ADMIN` |

### Module: Real-time Notifications
| Method | Endpoint | Description | Auth Requirement |
|:---|:---|:---|:---|
| **GET** | `/api/notifications/user/{userId}` | Retrieves all alerts for a specific user. | `Authenticated` |
| **PUT** | `/api/notifications/{id}/read` | Updates a notification status to "Seen". | `Authenticated` |
| **POST** | `/api/notifications/send` | Programmatically triggers a system alert. | `Authenticated` |

### Module: OAuth & Security Context
| Method | Endpoint | Description | Auth Requirement |
|:---|:---|:---|:---|
| **GET** | `/api/auth/me` | Fetches the profile of the currently logged-in user. | `Authenticated` |

---

## 3. Implementation Logic
*   **Data Persistence**: All endpoints interact with MongoDB via Spring Data Repositories.
*   **Security**: Role-Based Access Control (RBAC) is enforced at the controller level to prevent unauthorized access to administrative functions.
*   **Error Handling**: Returns consistent JSON objects containing error messages and appropriate status codes for failed operations.
