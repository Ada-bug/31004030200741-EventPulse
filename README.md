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
