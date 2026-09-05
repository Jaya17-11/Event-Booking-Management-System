# API Documentation

Base URL: `http://localhost:8080/api`

All authenticated requests require header: `Authorization: Bearer <token>`

---

## Authentication

### Register User
- **POST** `/users/register`
- **Access:** Public
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```
- **Response:** `201 Created` — UserResponseDTO (no password)

### Login
- **POST** `/auth/login`
- **Access:** Public
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** `200 OK`
```json
{
  "token": "JWT_TOKEN",
  "role": "USER",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## Users

### Get Profile
- **GET** `/users/profile`
- **Access:** Authenticated
- **Response:** UserResponseDTO

---

## Events (Public)

### List Events
- **GET** `/events`
- **Access:** Public
- **Response:** Array of EventResponseDTO

### Get Event
- **GET** `/events/{id}`
- **Access:** Public
- **Response:** EventResponseDTO

---

## Bookings (User)

### Create Booking
- **POST** `/bookings`
- **Access:** Authenticated USER
- **Body:**
```json
{
  "eventId": 1,
  "ticketsBooked": 2
}
```
- **Note:** User email is extracted from JWT — never send userId
- **Response:** `201 Created` — BookingResponseDTO

### My Bookings
- **GET** `/bookings/my`
- **Access:** Authenticated USER
- **Response:** Array of BookingResponseDTO

### Cancel Booking
- **PUT** `/bookings/{id}/cancel`
- **Access:** Authenticated USER (own bookings only)
- **Response:** BookingResponseDTO with status CANCELLED

---

## Admin

### Create Event
- **POST** `/admin/events`
- **Access:** ADMIN
- **Body:**
```json
{
  "eventName": "Rock Concert",
  "category": "Concert",
  "location": "Mumbai",
  "eventDate": "2026-12-25T19:00:00",
  "totalSeats": 500,
  "ticketPrice": 1500.00
}
```
- **Note:** availableSeats is auto-set to totalSeats

### Update Event
- **PUT** `/admin/events/{id}`
- **Access:** ADMIN

### Delete Event
- **DELETE** `/admin/events/{id}`
- **Access:** ADMIN

### Increase Seats
- **PATCH** `/admin/events/{id}/seats`
- **Access:** ADMIN
- **Body:**
```json
{
  "additionalSeats": 50
}
```
- **Note:** Updates both totalSeats and availableSeats

### All Bookings
- **GET** `/admin/bookings`
- **Access:** ADMIN

### Event Sales & Revenue
- **GET** `/admin/events/sales`
- **Access:** ADMIN
- **Response:**
```json
[
  {
    "eventId": 1,
    "eventName": "Rock Concert",
    "ticketsSold": 120,
    "revenue": 180000.00
  }
]
```

---

## Error Responses

All errors return:
```json
{
  "status": 404,
  "message": "Event not found with id: 99",
  "timestamp": "2026-08-01T12:00:00"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 401 | Unauthorized / invalid credentials |
| 403 | Forbidden / insufficient role |
| 404 | Resource not found |
| 500 | Internal server error |
