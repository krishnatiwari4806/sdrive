# API Documentation

## Authentication Endpoints

### Register
**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "documentType": "health" // or "government", "personal"
}
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "63f7d4c0f1e2b3c4d5e6f7g8",
    "name": "John Doe",
    "email": "john@example.com",
    "documentType": "health"
  }
}
```

### Login
**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "63f7d4c0f1e2b3c4d5e6f7g8",
    "name": "John Doe",
    "email": "john@example.com",
    "documentType": "health"
  }
}
```

### Get Current User
**Endpoint**: `GET /api/auth/me`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "user": {
    "_id": "63f7d4c0f1e2b3c4d5e6f7g8",
    "name": "John Doe",
    "email": "john@example.com",
    "documentType": "health",
    "storageUsed": 1024000,
    "storageLimit": 5368709120
  }
}
```

## Document Endpoints

### Get All Documents
**Endpoint**: `GET /api/documents`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "documents": [
    {
      "_id": "63f7d4c0f1e2b3c4d5e6f7g8",
      "name": "Medical Report.pdf",
      "description": "Annual checkup report",
      "documentType": "health",
      "fileType": "application/pdf",
      "fileSize": 1024000,
      "owner": "63f7d4c0f1e2b3c4d5e6f7g7",
      "folder": null,
      "tags": ["health", "checkup"],
      "isPublic": false,
      "createdAt": "2023-12-01T10:00:00Z",
      "updatedAt": "2023-12-01T10:00:00Z"
    }
  ]
}
```

### Get Document by ID
**Endpoint**: `GET /api/documents/:id`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "document": {
    "_id": "63f7d4c0f1e2b3c4d5e6f7g8",
    "name": "Medical Report.pdf",
    "description": "Annual checkup report",
    "documentType": "health",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "owner": "63f7d4c0f1e2b3c4d5e6f7g7",
    "folder": null,
    "tags": ["health", "checkup"],
    "isPublic": false,
    "sharedWith": [
      {
        "user": "63f7d4c0f1e2b3c4d5e6f7g9",
        "permission": "view"
      }
    ],
    "createdAt": "2023-12-01T10:00:00Z",
    "updatedAt": "2023-12-01T10:00:00Z"
  }
}
```

### Create Document
**Endpoint**: `POST /api/documents`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Family History.docx",
  "description": "Complete family health history",
  "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "fileSize": 2048000,
  "documentType": "health",
  "folder": "63f7d4c0f1e2b3c4d5e6f7h1",
  "tags": ["family", "health", "history"]
}
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "document": {
    "_id": "63f7d4c0f1e2b3c4d5e6f7g9",
    "name": "Family History.docx",
    "description": "Complete family health history",
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 2048000,
    "owner": "63f7d4c0f1e2b3c4d5e6f7g7",
    "documentType": "health",
    "folder": "63f7d4c0f1e2b3c4d5e6f7h1",
    "tags": ["family", "health", "history"],
    "isPublic": false,
    "createdAt": "2023-12-01T10:00:00Z"
  }
}
```

### Update Document
**Endpoint**: `PUT /api/documents/:id`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Updated Family History.docx",
  "description": "Updated family health history with recent additions",
  "documentType": "health",
  "tags": ["family", "health", "history", "updated"]
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "document": {
    "_id": "63f7d4c0f1e2b3c4d5e6f7g9",
    "name": "Updated Family History.docx",
    "description": "Updated family health history with recent additions",
    "documentType": "health",
    "tags": ["family", "health", "history", "updated"],
    "updatedAt": "2023-12-01T10:30:00Z"
  }
}
```

### Delete Document
**Endpoint**: `DELETE /api/documents/:id`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Document deleted"
}
```

## Folder Endpoints

### Get All Folders
**Endpoint**: `GET /api/folders`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "folders": [
    {
      "_id": "63f7d4c0f1e2b3c4d5e6f7h1",
      "name": "Medical Records",
      "owner": "63f7d4c0f1e2b3c4d5e6f7g7",
      "parentFolder": null,
      "isPublic": false,
      "createdAt": "2023-12-01T09:00:00Z"
    }
  ]
}
```

### Create Folder
**Endpoint**: `POST /api/folders`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Government Documents",
  "parentFolder": null
}
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "folder": {
    "_id": "63f7d4c0f1e2b3c4d5e6f7h2",
    "name": "Government Documents",
    "owner": "63f7d4c0f1e2b3c4d5e6f7g7",
    "parentFolder": null,
    "isPublic": false,
    "createdAt": "2023-12-01T10:00:00Z"
  }
}
```

### Update Folder
**Endpoint**: `PUT /api/folders/:id`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Important Government Docs"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "folder": {
    "_id": "63f7d4c0f1e2b3c4d5e6f7h2",
    "name": "Important Government Docs"
  }
}
```

### Delete Folder
**Endpoint**: `DELETE /api/folders/:id`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Folder deleted"
}
```

## Sharing Endpoints

### Share Document
**Endpoint**: `POST /api/sharing/document`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "documentId": "63f7d4c0f1e2b3c4d5e6f7g8",
  "userId": "63f7d4c0f1e2b3c4d5e6f7g9",
  "permission": "view"
}
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "message": "Document shared successfully"
}
```

### Share Folder
**Endpoint**: `POST /api/sharing/folder`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body**:
```json
{
  "folderId": "63f7d4c0f1e2b3c4d5e6f7h1",
  "userId": "63f7d4c0f1e2b3c4d5e6f7g9",
  "permission": "view"
}
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "message": "Folder shared successfully"
}
```

### Get Shared Documents/Folders
**Endpoint**: `GET /api/sharing/shared-with-me`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "documents": [
    {
      "_id": "63f7d4c0f1e2b3c4d5e6f7g8",
      "name": "Shared Health Document.pdf"
    }
  ],
  "folders": [
    {
      "_id": "63f7d4c0f1e2b3c4d5e6f7h1",
      "name": "Shared Folder"
    }
  ]
}
```

### Revoke Share
**Endpoint**: `DELETE /api/sharing/:docId/user/:userId`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Share revoked"
}
```

## Error Responses

### Bad Request (400)
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Not authorized"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Document not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server error"
}
```

## Permission Levels

- **view**: User can only view the document/folder
- **edit**: User can view and edit metadata
- **download**: User can view, edit, and download
