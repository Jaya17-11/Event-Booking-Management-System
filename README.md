# Event Ticket Booking System

A production-ready full stack event ticket booking platform built with **Spring Boot** (Java 17) and **React.js**.

## Features

- JWT-based authentication with role-based access (USER / ADMIN)
- Public event browsing without login
- Ticket booking with real-time seat management
- Booking cancellation with seat restoration
- Admin panel for event CRUD, seat management, and sales analytics
- Responsive Bootstrap 5 UI with toast notifications

## Tech Stack

| Layer    | Technologies |
|----------|-------------|
| Backend  | Java 17, Spring Boot 3.2, Spring Security, JWT, Hibernate/JPA, MySQL, Maven, Lombok |
| Frontend | React 18, React Router DOM, Axios, Bootstrap 5, Context API, React Toastify |
| Database | MySQL 8 |

## Project Structure

```
event-ticket-booking-system/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/eventbooking/
│       ├── EventTicketBookingApplication.java
│       ├── controller/       # REST controllers
│       ├── service/          # Business logic
│       ├── repository/       # JPA repositories
│       ├── entity/           # JPA entities
│       ├── dto/              # Data transfer objects
│       ├── security/         # JWT filter, util, config
│       ├── exception/        # Custom exceptions & handler
│       └── config/           # Security, CORS, mapper, data init
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── api/              # Axios instance
│       ├── context/          # AuthContext
│       ├── components/       # Navbar, Spinner, Dialog
│       ├── pages/              # Public & user pages
│       ├── pages/admin/        # Admin pages
│       └── routes/             # Protected & admin routes
├── database/
│   └── schema.sql
├── postman/
│   └── Event-Ticket-Booking.postman_collection.json
└── README.md
```

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

## Database Setup

1. Start MySQL server
2. Run the schema script (optional — Hibernate auto-creates tables):

```bash
mysql -u root -p < database/schema.sql
```

3. Update database credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

## Backend Setup & Run

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at **http://localhost:8080**

### Default Admin Account

Created automatically on first startup:

| Email | Password |
|-------|----------|
| admin@eventbooking.com | admin123 |

## Frontend Setup & Run

```bash
cd frontend
npm install
npm start
```

Frontend runs at **http://localhost:3000**

## API Documentation

Base URL: `http://localhost:8080/api`

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/events` | List all events |
| GET | `/events/{id}` | Get event details |

### User Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | View logged-in user profile |
| POST | `/bookings` | Book tickets for an event |
| GET | `/bookings/my` | View own bookings |
| PUT | `/bookings/{id}/cancel` | Cancel own booking |

### Admin Endpoints (JWT + ADMIN Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/events` | Create event |
| PUT | `/admin/events/{id}` | Update event |
| DELETE | `/admin/events/{id}` | Delete event |
| PATCH | `/admin/events/{id}/seats` | Increase available seats |
| GET | `/admin/bookings` | View all bookings |
| GET | `/admin/events/sales` | Ticket sales & revenue per event |

### Authentication

Include JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Sample Login Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "ADMIN",
  "name": "Admin",
  "email": "admin@eventbooking.com"
}
```

## Postman Collection

Import `postman/Event-Ticket-Booking.postman_collection.json` into Postman.

1. Run **Login Admin** or **Login User** — token is auto-saved
2. Use other requests with the saved token

## Security

- BCrypt password encryption
- Stateless JWT sessions
- Role-based endpoint protection
- User ID extracted from JWT (never accepted in booking requests)
- CORS configured for frontend origin

## License

MIT

## Project Features

- Single administrator account is created automatically; public registration always creates USER accounts.
- Event status is maintained automatically as UPCOMING, SOLD_OUT, or EXPIRED.
- Booking and cancellation close exactly one hour before the event start time.
- Ticket inventory is decreased atomically while booking and restored when a booking is cancelled.
- Pessimistic database locking prevents concurrent bookings from overselling tickets.
- Cancelled bookings restore inventory without deleting booking history.
- Events with active bookings cannot be deleted accidentally.
- Frontend includes human-centered event discovery, search, category filtering, availability/status messaging, and a clearer booking experience.
