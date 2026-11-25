
# QuickNotes API Design

## 1. Introduction

QuickNotes is a note-taking application that allows users to create, view, update, and delete notes.

The API will use REST principles and communicate using JSON over HTTP.

Base URL:

`https://api.quicknotes.com/v1`

## 2. REST API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | /notes | Retrieve all notes belonging to the user | 200 OK |
| GET | /notes/{id} | Retrieve one note by its ID | 200 OK |
| POST | /notes | Create a new note | 201 Created |
| PUT | /notes/{id} | Replace an existing note | 200 OK |
| PATCH | /notes/{id} | Update selected note fields | 200 OK |
| DELETE | /notes/{id} | Delete a note | 204 No Content |
| GET | /tags | Retrieve all tags belonging to the user | 200 OK |

## 3. Request and Response Examples

### A. Create a Note (POST /notes)

Request:

```json
{
  "title": "My First Note",
  "body": "Learning how to design REST APIs.",
  "tagIds": [1, 2]
}
```

Response:

Status: 201 Created

```json
{
  "id": 101,
  "userId": 1,
  "title": "My First Note",
  "body": "Learning how to design REST APIs.",
  "createdAt": "2026-11-25T10:00:00Z",
  "updatedAt": "2026-11-25T10:00:00Z",
  "tags": [
    {
      "id": 1,
      "name": "Learning"
    },
    {
      "id": 2,
      "name": "Technology"
    }
  ]
}
```

### B. List Notes (GET /notes)

Request:

`GET /notes`

Response:

Status: 200 OK

```json
{
  "notes": [
    {
      "id": 101,
      "userId": 1,
      "title": "My First Note",
      "body": "Learning how to design REST APIs.",
      "createdAt": "2026-11-25T10:00:00Z"
    },
    {
      "id": 102,
      "userId": 1,
      "title": "Shopping List",
      "body": "Buy milk and bread.",
      "createdAt": "2026-11-25T11:00:00Z"
    }
  ],
  "total": 2
}
```

## 4. HTTP Status Codes

The API will use the following status codes:

| Status Code | Meaning | Description |
|---|---|---|
| 200 | OK | Request completed successfully |
| 201 | Created | A new note was created |
| 204 | No Content | Note deleted successfully |
| 400 | Bad Request | Invalid input or missing required fields |
| 401 | Unauthorized | User is not authenticated |
| 403 | Forbidden | User does not have permission |
| 404 | Not Found | Requested note does not exist |
| 500 | Internal Server Error | Unexpected server error |

## 5. Error Response Example

When a request fails, the API returns a clear error message.

Example:

Status: 400 Bad Request

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The note title is required."
  }
}
```

Another example:

Status: 404 Not Found

```json
{
  "error": {
    "code": "NOTE_NOT_FOUND",
    "message": "The requested note could not be found."
  }
}
```

## 6. Authentication and Security

Users will authenticate using secure access tokens.

The API will check the identity of each user before allowing access to their notes.

Users will only be allowed to view, update, or delete notes that belong to them.

The API will validate incoming data to prevent invalid requests.

## 7. Conclusion

The QuickNotes API uses REST principles, HTTP methods, JSON data, and appropriate status codes.

The endpoints provide the main operations needed to create, read, update, and delete notes while protecting users' information.
