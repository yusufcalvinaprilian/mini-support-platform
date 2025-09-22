# Support Platform API Endpoints

## Base URL

```
http://localhost:5001
```

## Authentication Endpoints

### Register User

```http
POST /api/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Login User

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

## User Endpoints

### Get All Users (with pagination)

```http
GET /api/users?page=1&limit=10
```

### Get User by ID

```http
GET /api/users/:id
```

### Get User by Support Link

```http
GET /api/users/support/:supportLink
```

### Update User Profile

```http
PUT /api/users/:id
Content-Type: application/json

{
  "fullName": "John Updated",
  "bio": "Updated bio",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Delete User (Soft Delete)

```http
DELETE /api/users/:id
```

## System Endpoints

### Health Check

```http
GET /health
```

### API Status

```http
GET /
```

## Response Format

### Success Response

```json
{
	"success": true,
	"message": "Operation successful",
	"data": {
		// Response data
	}
}
```

### Error Response

```json
{
	"success": false,
	"message": "Error message",
	"error": "Detailed error (development only)"
}
```

## Testing dengan cURL

### Register User

```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### Login User

```bash
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get All Users

```bash
curl -X GET http://localhost:5001/api/users
```
