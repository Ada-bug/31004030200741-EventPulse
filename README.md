# EventPulse

EventPulse is a Node.js and Express-based event management API that allows users to discover events, register for them, and receive real-time announcements. The application uses MongoDB for data persistence, JWT for authentication, and Socket.IO for real-time communication.

## Features

- User registration and JWT-based authentication
- Role-based authorization with `attendee` and `admin` roles
- Event creation, retrieval, updating, and deletion
- Event categories
- Event search and filtering
- Date-range filtering
- City filtering
- Pagination
- Sorting by event date or registration count
- Event registration and cancellation
- Capacity enforcement for events
- Duplicate-registration prevention
- Event-specific announcements
- Real-time announcements using Socket.IO
- Swagger/OpenAPI API documentation
- Request validation with `express-validator`
- MongoDB query sanitization
- Centralized error handling
- API health-check endpoint
- Database seeding
- Unit and integration testing setup

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO

### Authentication & Security

- JSON Web Tokens (JWT)
- bcryptjs
- express-validator
- express-mongo-sanitize

### Documentation & Development

- Swagger / OpenAPI
- Morgan
- Jest
- Supertest
- Nodemon

## Project Structure

```text
EventPulse/
├── config/
│   ├── appConfig.js
│   ├── db.js
│   └── swagger.js
├── controllers/
│   ├── announcements.controller.js
│   ├── authController.js
│   ├── events.controller.js
│   └── registrations.controller.js
├── data/
│   └── seedData.js
├── middleware/
│   ├── errorHandler.js
│   ├── requireAuth.js
│   ├── requireRole.js
│   └── validate.js
├── models/
│   ├── category.model.js
│   ├── event.model.js
│   ├── message.model.js
│   ├── registration.model.js
│   └── user.model.js
├── postman/
├── public/
├── routes/
│   ├── announcements.routes.js
│   ├── authRoutes.js
│   ├── events.routes.js
│   └── registrations.routes.js
├── tests/
│   ├── integration/
│   └── unit/
├── utils/
│   ├── AppError.js
│   └── asyncHandler.js
├── app.js
├── seed.js
└── package.json

## Data Models

EventPulse uses five main Mongoose models.

### User

Represents users of the application.

Users have:

- Name
- Email
- Password
- Role

Available roles:

- `attendee`
- `admin`

Passwords are hashed using bcrypt before being stored.

### Event

Represents an event organized through EventPulse.

An event contains:

- Title
- Description
- Category
- Date
- City
- Venue
- Capacity
- Organizer

### Category

Represents an event category.

Categories contain:

- Name
- Description

Category names are unique.

### Registration

Represents a user's registration for an event.

A registration contains:

- Event
- Attendee

A unique compound index prevents the same attendee from registering for the same event more than once.

### Message

Messages power the EventPulse announcement system.

Each message contains:

- Event
- Sender
- Text
- Creation/update timestamps

Although the underlying model is named `Message`, it is exposed through the API as an **announcement**.

## Installation

Navigate to the project directory:

```bash
cd 31004030200741-EventPulse
```

Install the project dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port used by the server | `3000` |
| `NODE_ENV` | Application environment | `development` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret used to sign JWTs | Required |
| `JWT_EXPIRES_IN` | JWT expiration duration | `7d` |

> **Important:** Never commit your `.env` file or expose your `JWT_SECRET`.

## Running the Application

### Development

Start the development server with Nodemon:

```bash
npm run dev
```

### Production

Start the application with Node:

```bash
npm start
```

By default, the server runs on:

```text
http://localhost:3000
```

The port can be changed using the `PORT` environment variable.

## Database Seeding

EventPulse includes a seed script for populating the database with initial data.

Run:

```bash
npm run seed
```

The seed script clears the following collections before inserting the seed data:

- Messages
- Registrations
- Events
- Categories
- Users

Seed data is loaded from:

```text
data/seedData.js
```

> **Warning:** Running `npm run seed` deletes existing users, categories, events, registrations, and messages from the database.

## Authentication

EventPulse uses JWT-based bearer authentication.

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Newly registered users are automatically assigned the `attendee` role.

A successful registration returns a JWT:

```json
{
  "status": "success",
  "token": "YOUR_JWT_TOKEN",
  "data": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "attendee"
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

Example request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

A successful login returns a JWT token.

For protected endpoints, include the token in the `Authorization` header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

### Authentication

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new attendee |
| `POST` | `/api/auth/login` | No | Log in and receive a JWT |

### Events

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `GET` | `/api/events` | No | Get all events |
| `GET` | `/api/events/:id` | No | Get a specific event |
| `POST` | `/api/events` | Yes | Create an event |
| `PATCH` | `/api/events/:id` | Yes | Update an event |
| `DELETE` | `/api/events/:id` | Admin | Delete an event |

### Registrations

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `POST` | `/api/registrations` | Yes | Register for an event |
| `GET` | `/api/registrations/my` | Yes | Get the current user's registrations |
| `DELETE` | `/api/registrations/:id` | Yes | Cancel your own registration |

### Announcements

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `POST` | `/api/announcements` | Admin | Create an announcement |
| `GET` | `/api/announcements/:eventId` | No | Get announcements for an event |

## Event Search and Filtering

The `GET /api/events` endpoint supports filtering, searching, pagination, and sorting.

### Query Parameters

| Parameter | Description |
|---|---|
| `startDate` | Return events from this date |
| `endDate` | Return events until this date |
| `category` | Filter by category ID |
| `city` | Filter by city |
| `search` | Search event title or description |
| `page` | Page number |
| `limit` | Number of events per page |
| `sortBy` | Sort events by `registrations` |
| `order` | Sort order: `asc` or `desc` |

Example:

```http
GET /api/events?city=Bucharest&search=conference&page=1&limit=10
```

By default, events are sorted by date.

To sort events by registration count:

```http
GET /api/events?sortBy=registrations&order=desc
```

The endpoint returns pagination information:

```json
{
  "status": "success",
  "data": [],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```
## Event Registration

Authenticated users can register for events.

```http
POST /api/registrations
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Request body:

```json
{
  "event": "EVENT_ID"
}
```

The registration system includes several safeguards:

- The event must exist.
- The event ID must be a valid MongoDB ObjectId.
- Users cannot register for the same event more than once.
- Registration is rejected when the event has reached its capacity.
- Users can only cancel their own registrations.

### View My Registrations

```http
GET /api/registrations/my
Authorization: Bearer YOUR_JWT_TOKEN
```

Returns all registrations belonging to the authenticated user, including the associated event.

### Cancel a Registration

```http
DELETE /api/registrations/REGISTRATION_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

Users can only cancel registrations that belong to themselves.

## Real-Time Announcements

EventPulse uses **Socket.IO** to deliver event announcements in real time.

Clients can join an event-specific Socket.IO room using the `join-event` event:

```javascript
socket.emit('join-event', 'EVENT_ID');
```

When an administrator creates an announcement, the server:

1. Stores the announcement in MongoDB.
2. Sends the announcement to the Socket.IO room associated with the event.
3. Connected clients receive the announcement through the `announcement` event.

The communication flow is:

```text
Client
   │
   │ join-event(eventId)
   ▼
Socket.IO Server
   │
   ▼
Event-specific room
   │
   │ announcement
   ▼
Connected clients
```

### Example Socket.IO Client

```javascript
const socket = io('http://localhost:3000');

socket.emit('join-event', 'EVENT_ID');

socket.on('announcement', (message) => {
  console.log('New announcement:', message);
});
```

Only administrators can create announcements through the REST API:

```http
POST /api/announcements
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```

Example request:

```json
{
  "eventId": "EVENT_ID",
  "text": "The event will begin at 18:00."
}
```

Announcements can be retrieved through:

```http
GET /api/announcements/EVENT_ID
```

## Swagger API Documentation

EventPulse provides interactive API documentation using Swagger/OpenAPI.

With the server running, open:

```text
http://localhost:3000/api-docs
```

The API uses OpenAPI 3.0 and supports JWT bearer authentication in Swagger.

## Health Check

The application provides a health-check endpoint:

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "environment": "development",
  "uptime": 123.456,
  "database": "connected"
}
```

The endpoint can be used to verify that the server is running and that the application can connect to MongoDB.

## Validation and Error Handling

EventPulse uses `express-validator` to validate incoming request data.

Validation includes:

- Email format
- Minimum password length
- MongoDB ObjectId format
- Event dates
- Event capacity
- Required event fields

The application also uses centralized error handling through `AppError` and the error-handler middleware.

Common HTTP status codes include:

| Status Code | Meaning |
|---|---|
| `400` | Bad Request — invalid request data |
| `401` | Unauthorized — authentication required or invalid/expired JWT |
| `403` | Forbidden — insufficient permissions |
| `404` | Not Found — requested resource does not exist |
| `409` | Conflict — duplicate registration |

## Security

EventPulse includes several security measures:

- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization
- Request validation
- MongoDB query sanitization
- Protected API routes
- Registration ownership checks
- Unique email constraint for users
- Unique event/attendee constraint for registrations

## Testing

The project uses **Jest** for testing and **Supertest** for HTTP/API integration testing.

Run the test suite with:

```bash
npm test
```

Tests are organized into:

```text
tests/
├── integration/
└── unit/
```

## Available NPM Scripts

| Command | Description |
|---|---|
| `npm start` | Start the application |
| `npm run dev` | Start the development server with Nodemon |
| `npm test` | Run Jest tests |
| `npm run seed` | Clear and seed the database |

## API Architecture

EventPulse follows a layered Express architecture:

```text
HTTP Request
     │
     ▼
   Routes
     │
     ▼
 Middleware
     │
     ├── Authentication
     ├── Authorization
     └── Validation
     │
     ▼
 Controllers
     │
     ▼
 Mongoose Models
     │
     ▼
   MongoDB
```

Socket.IO runs alongside the Express HTTP server to provide real-time communication:

```text
                    ┌──────────────┐
                    │   Express    │
                    │     API      │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Controllers  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   MongoDB    │
                    └──────────────┘

Client ─────────────► Socket.IO
                         │
                         ▼
                  Event-specific rooms
                         │
                         ▼
                  Live announcements
```
