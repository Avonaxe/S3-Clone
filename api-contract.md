# S3-Clone API Contract

## 1. General Conventions

- **Base URL:** All endpoints are relative to the backend root (e.g., `http://localhost:8080`).
- **Prefix:** All API routes are prefixed with `/api`.
- **Authentication:** JWT Bearer tokens are required for all endpoints except **Registration** and **Login**.
  - Header format: `Authorization: Bearer <token>`
- **Content-Type:**
  - JSON requests/responses use `application/json`.
  - File uploads use `multipart/form-data`.
- **Timestamps:** All date/time fields are ISO-8601 strings (e.g., `2024-06-15T10:30:00Z`).
- **Naming:** All JSON keys use `camelCase`.
- **Error Response Format:** On failure, the API returns a consistent JSON error body:
  ```json
  {
    "status": 404,
    "error": "Not Found",
    "message": "Human-readable description of what went wrong"
  }
  ```

---

## 2. User Identity

### 2.1 Register

Create a new user account.

- **Endpoint:** `POST /api/auth/register`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "username": "string (required, unique)",
    "password": "string (required, min 6 characters)"
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "id": 1,
    "username": "string",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```
- **Error Responses:**
  - `400 Bad Request` — Validation error (e.g., missing fields, password too short).
  - `409 Conflict` — Username already exists.

### 2.2 Login

Authenticate and receive a JWT.

- **Endpoint:** `POST /api/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "username": "string (required)",
    "password": "string (required)"
  }
  ```
- **Success Response:** `200 OK`
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "type": "Bearer"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized` — Invalid username or password.

---

## 3. Bucket Management

All bucket endpoints require the `Authorization: Bearer <token>` header.

### 3.1 Create Bucket

Create a new bucket for the authenticated user.

- **Endpoint:** `POST /api/buckets`
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "bucketName": "string (required, unique per user)"
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "bucketName": "string",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```
- **Error Responses:**
  - `400 Bad Request` — Invalid bucket name format.
  - `401 Unauthorized` — Missing or invalid JWT.
  - `409 Conflict` — Bucket name already exists for this user.

### 3.2 List Buckets

Retrieve all buckets owned by the authenticated user.

- **Endpoint:** `GET /api/buckets`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:** *None*
- **Success Response:** `200 OK`
  ```json
  [
    {
      "bucketName": "string",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
  ```
- **Error Responses:**
  - `401 Unauthorized` — Missing or invalid JWT.

### 3.3 Delete Bucket

Delete an empty bucket owned by the authenticated user.

- **Endpoint:** `DELETE /api/buckets/{bucketName}`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:** *None*
- **Success Response:** `204 No Content`
- **Error Responses:**
  - `401 Unauthorized` — Missing or invalid JWT.
  - `404 Not Found` — Bucket does not exist.
  - `409 Conflict` — Bucket is not empty.

---

## 4. Object Management

All object endpoints require the `Authorization: Bearer <token>` header.

### 4.1 Upload Object

Upload a file into a specific bucket. If an object with the same filename already exists, it is overwritten.

- **Endpoint:** `POST /api/buckets/{bucketName}/objects`
- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body:** `multipart/form-data`
  - `file` (required) — The binary file to upload.
- **Success Response:** `201 Created`
  ```json
  {
    "id": 1,
    "bucketName": "string",
    "filename": "string",
    "contentType": "string",
    "sizeBytes": 12345,
    "uploadTime": "2024-01-01T00:00:00Z"
  }
  ```
- **Error Responses:**
  - `400 Bad Request` — No file provided in the request.
  - `401 Unauthorized` — Missing or invalid JWT.
  - `404 Not Found` — Bucket does not exist.

### 4.2 List Bucket Contents

List metadata for all objects inside a specific bucket.

- **Endpoint:** `GET /api/buckets/{bucketName}/objects`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:** *None*
- **Success Response:** `200 OK`
  ```json
  [
    {
      "id": 1,
      "filename": "string",
      "contentType": "string",
      "sizeBytes": 12345,
      "uploadTime": "2024-01-01T00:00:00Z"
    }
  ]
  ```
- **Error Responses:**
  - `401 Unauthorized` — Missing or invalid JWT.
  - `404 Not Found` — Bucket does not exist.

### 4.3 Download Object

Stream the raw bytes of an object back to the client.

- **Endpoint:** `GET /api/buckets/{bucketName}/objects/{objectName}`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:** *None*
- **Success Response:** `200 OK`
  - `Content-Type: <actual-object-content-type>` (e.g., `image/png`, `text/plain`)
  - Body: Raw binary file stream.
- **Error Responses:**
  - `401 Unauthorized` — Missing or invalid JWT.
  - `404 Not Found` — Bucket or object does not exist.

### 4.4 Delete Object

Remove an object from a bucket and delete its underlying file from disk.

- **Endpoint:** `DELETE /api/buckets/{bucketName}/objects/{objectName}`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:** *None*
- **Success Response:** `204 No Content`
- **Error Responses:**
  - `401 Unauthorized` — Missing or invalid JWT.
  - `404 Not Found` — Bucket or object does not exist.

### 4.5 Retrieve Object Metadata

Fetch full metadata for a single object without downloading its contents.

- **Endpoint:** `GET /api/buckets/{bucketName}/objects/{objectName}/metadata`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:** *None*
- **Success Response:** `200 OK`
  ```json
  {
    "id": 1,
    "bucketName": "string",
    "filename": "string",
    "contentType": "string",
    "sizeBytes": 12345,
    "uploadTime": "2024-01-01T00:00:00Z",
    "filePath": "storage/{userId}/{bucketName}/{filename}"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized` — Missing or invalid JWT.
  - `404 Not Found` — Bucket or object does not exist.

---

## 5. Implicit Data Model (for reference)

While this document specifies only the API surface, the following resources are assumed on the backend to satisfy the contracts above:

- **User:** `id`, `username`, `passwordHash`, `createdAt`
- **Bucket:** `id`, `userId`, `bucketName`, `createdAt`
- **ObjectMetadata:** `id`, `userId`, `bucketName`, `filename`, `filePath`, `contentType`, `sizeBytes`, `uploadTime`
