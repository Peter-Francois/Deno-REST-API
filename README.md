# Deno REST API

A beginner-friendly Deno REST API with basic CRUD operations and in-memory storage.

## Features

- Simple REST API with basic CRUD operations
- File handling functionality
- Local data storage (in-memory)
- Basic error handling
- Request logging

## Prerequisites

- [Deno](https://deno.land/) installed on your machine

## Getting Started

1. Clone this repository
2. Navigate to the project directory
3. Run the server:

```bash
deno run --allow-net --allow-read --allow-write app.ts
```

The server will start on port 5000 by default.

## API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Endpoints

#### Items

| Method | Endpoint        | Description                       |
|--------|-----------------|-----------------------------------|
| GET    | /items          | Get all items                     |
| GET    | /items/:id      | Get a specific item by ID         |
| POST   | /items          | Create a new item                 |
| PUT    | /items/:id      | Update an existing item           |
| DELETE | /items/:id      | Delete an item                    |

##### Example Item Object

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Example Item",
  "description": "This is an example item",
  "createdAt": "2023-04-01T12:00:00Z",
  "updatedAt": "2023-04-01T12:00:00Z"
}
```

#### Files

| Method | Endpoint        | Description                       |
|--------|-----------------|-----------------------------------|
| GET    | /files          | List all uploaded files           |
| GET    | /files/:filename| Download a specific file          |
| POST   | /files          | Upload a file                     |
| DELETE | /files/:filename| Delete a file                     |

## Usage Examples

### Creating a new item

```bash
curl -X POST http://localhost:5000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{"name": "New Item", "description": "This is a new item"}'
```

### Getting all items

```bash
curl http://localhost:5000/api/v1/items
```

### Uploading a file

```bash
curl -X POST http://localhost:5000/api/v1/files \
  -F "file=@/path/to/your/file.txt"
```

## Project Structure

```
├── app.ts                # Main application entry point
├── db/
│   └── inMemoryDb.ts     # In-memory database implementation
├── middleware/
│   ├── errorHandler.ts   # Error handling middleware
│   └── logger.ts         # Request logging middleware
├── models/
│   └── item.ts           # Item model definition and validation
├── routes/
│   ├── files.ts          # File handling endpoints
│   ├── index.ts          # Main router configuration
│   └── items.ts          # Item CRUD endpoints
└── utils/
    └── helpers.ts        # Utility functions
```

## Learning Resources

- [Deno Documentation](https://deno.land/manual)
- [Oak Framework](https://deno.land/x/oak)
