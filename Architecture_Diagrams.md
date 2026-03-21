# Smart Campus Operations Hub - Architecture Diagrams
You can copy and paste these Mermaid graph code blocks into any Markdown viewer that supports Mermaid (like GitHub, Notion, or a Mermaid Live Editor) to generate the images for your final PDF report.

## 1. Overall System Architecture
This diagram illustrates the high-level layered architecture of the application, showing how the React frontend interacts with the Spring Boot backend and MySQL database.

```mermaid
graph TD
    %% Define Nodes
    Client["React Web Client (Vite)"]
    API_Gateway["Spring Boot REST API"]
    Auth["OAuth 2.0 (Google Sign-in) & JWT Filter"]
    Controllers["REST Controllers (Endpoints)"]
    Services["Business Logic Services"]
    Repositories["Spring Data JPA Repositories"]
    DB[("MySQL Database")]

    %% Connections
    Client -- "HTTP/REST + JWT" --> API_Gateway
    Client -. "OAuth Flow" .-> Auth
    API_Gateway --> Auth
    Auth -- "Validates & Routes" --> Controllers
    Controllers -- "DTOs / Models" --> Services
    Services -- "Entities" --> Repositories
    Repositories -- "JPA/Hibernate Queries" --> DB
```

## 2. REST API Architecture (Backend)
This demonstrates the layered architecture of the Spring Boot application specifically, separating concerns between routing, business logic, and data access.

```mermaid
graph LR
    %% Grouping
    subgraph Presentation Layer
        AuthController
        ResourceController
        BookingController
        TicketController
        NotificationController
    end

    subgraph Business Layer
        UserService
        ResourceService
        BookingService
        TicketService
        NotificationService
    end

    subgraph Data Access Layer
        UserRepository
        ResourceRepository
        BookingRepository
        TicketRepository
        NotificationRepository
    end

    %% Connections
    AuthController --> UserService
    ResourceController --> ResourceService
    BookingController --> BookingService
    TicketController --> TicketService
    NotificationController --> NotificationService

    %% Cross-Service dependencies
    BookingService --> ResourceService
    BookingService --> NotificationService
    TicketService --> ResourceService
    TicketService --> NotificationService

    %% Repositories
    UserService --> UserRepository
    ResourceService --> ResourceRepository
    BookingService --> BookingRepository
    TicketService --> TicketRepository
    NotificationService --> NotificationRepository
```

## 3. Frontend Architecture (React)
This diagram maps out how the React application is structured, including contexts, routing, and key pages.

```mermaid
graph TD
    %% Nodes
    AppRouter["App Router (React Router DOM)"]
    AuthC["AuthContext (State & Login)"]
    NotifC["NotificationContext (Global Toasts)"]
    Axios["Axios API Interceptor (JWT injection)"]
    
    %% Views
    PubView["Public Views"]
    Login["Login Page (OAuth Button)"]
    
    PrivView["Private / Protected Views"]
    Dashboard["Student Dashboard"]
    TechDesk["Technician Service Desk"]
    AdminPanel["Admin Booking Panel"]
    Catalogue["Facilities Catalogue"]
    Report["Report Issue Form"]
    TicketView["Ticket Details View"]
    Notifications["Notification Inbox"]

    %% Connections
    AuthC --> AppRouter
    NotifC --> AppRouter
    AppRouter --> PubView
    AppRouter --> PrivView
    
    PubView --> Login
    PrivView --> Dashboard
    PrivView --> TechDesk
    PrivView --> AdminPanel
    PrivView --> Catalogue
    PrivView --> Report
    PrivView --> TicketView
    PrivView --> Notifications

    %% All private views use Axios
    PrivView -. "API Calls" .-> Axios
```
