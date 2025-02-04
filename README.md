# Event System API

## Installation

1. Clone the repository

```bash
git clone <repository_url>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="your_postgresql_database_url"
JWT_SECRET="your_jwt_secret"
PORT=3000
```

4. Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

# API Documentation

## Authentication Routes

### Login

- **Endpoint**: GET /api/auth/login
- **Purpose**: Authenticate user and get access token
- **Required Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Login successful",
    "token": "JWT_TOKEN"
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "Invalid username or password"
  }
  ```

### Register

- **Endpoint**: POST /api/auth/register
- **Purpose**: Create new user account
- **Required Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "username": "string",
    "firstName": "string",
    "lastName": "string"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "User created successfully",
    "data": {
      "id": "number",
      "email": "string",
      "username": "string",
      "first_name": "string",
      "last_name": "string"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "User already exists"
  }
  ```

### Logout

- **Endpoint**: GET /api/auth/logout
- **Purpose**: Clear authentication token
- **Success Response**:
  ```json
  {
    "message": "Logout successful"
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "Authentication required"
  }
  ```

## User Routes

### Get User Profile

- **Endpoint**: GET /api/user/:username
- **Purpose**: Retrieve user profile information
- **Authentication**: Required
- **Success Response**:
  ```json
  {
    "status": "success",
    "user": {
      "id": "number",
      "email": "string",
      "username": "string"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "User not found"
  }
  ```

## Event Routes

### Get All Events

- **Endpoint**: GET /api/events
- **Purpose**: Retrieve all events
- **Authentication**: Required
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Events fetched successfully",
    "data": [Event[]]
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "Failed to fetch events",
    "error": "Error details"
  }
  ```

### Get Single Event

- **Endpoint**: GET /api/events/:eventID
- **Purpose**: Get details of specific event
- **Authentication**: Required
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Event fetched successfully",
    "data": Event
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "Event not found"
  }
  ```

### Create Event

- **Endpoint**: POST /api/events
- **Purpose**: Create new event
- **Authentication**: Required
- **Required Body**:
  ```json
  {
    "userId": "number",
    "eventTitle": "string",
    "description": "string",
    "date": "string",
    "location": "string",
    "maxAttendees": "number"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Event created successfully",
    "data": Event
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "Failed to create event",
    "error": "Missing required parameters"
  }
  ```

### Update Event

- **Endpoint**: PATCH /api/events/:eventID
- **Purpose**: Modify existing event
- **Authentication**: Required
- **Optional Body** (at least one field required):
  ```json
  {
    "eventTitle": "string",
    "description": "string",
    "date": "string",
    "location": "string",
    "maxAttendees": "number"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Event updated successfully",
    "data": Event
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "Failed to update event",
    "error": "Event not found"
  }
  ```

### Delete Event

- **Endpoint**: DELETE /api/events/:eventID
- **Purpose**: Remove event and all related registrations
- **Authentication**: Required
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Event deleted successfully"
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "Failed to delete event",
    "error": "Event not found"
  }
  ```

## Event Registration Routes

### Get User's Joined Events

- **Endpoint**: GET /api/my-events/:userID
- **Purpose**: List all events user has registered for
- **Authentication**: Required
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Joined Events fetched successfully",
    "data": [JoinedEvent[]]
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "Failed to fetch events",
    "error": "User not found"
  }
  ```

### Register for Event

- **Endpoint**: POST /api/my-events/:userID/:eventID
- **Purpose**: Register user for an event
- **Authentication**: Required
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Registered to event successfully",
    "data": JoinedEvent
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "Failed to register to event",
    "error": "Already registered to this event"
  }
  ```

### Unregister from Event

- **Endpoint**: DELETE /api/my-events/:userID/:eventID
- **Purpose**: Remove user registration from event
- **Authentication**: Required
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Unregistered from event successfully",
    "data": JoinedEvent
  }
  ```
- **Error Response**:
  ```json
  {
    "status": "error",
    "message": "Failed to unregister from event",
    "error": "Not registered to this event"
  }
  ```

## Authentication

All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Responses

All endpoints may return the following error responses:

- **400 Bad Request**: Missing or invalid parameters
- **401 Unauthorized**: Invalid or missing authentication token
- **403 Forbidden**: Insufficient permissions
- **500 Server Error**: Internal server error

Error response format:

```json
{
  "status": "error",
  "message": "Error description",
  "error": "Error details"
}
```
