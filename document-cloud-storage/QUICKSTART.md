## Quick Start Guide

### 1. Install Dependencies (Backend)
```bash
cd backend
npm install
```

### 2. Configure Environment
Edit `backend/.env` with your settings:
```env
MONGODB_URI=mongodb://localhost:27017/document-storage
JWT_SECRET=your-secret-key
```

### 3. Start MongoDB
```bash
mongod
```

### 4. Start Backend Server
```bash
cd backend
npm start
```

### 5. Access Application
Open browser and go to: `http://localhost:5000`

### 6. Create Account
- Click "Register"
- Fill in your details
- Submit form to create account

### 7. Login
- Use your registered email and password
- Start uploading documents!

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "documentType": "health"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Documents
```bash
curl -X GET http://localhost:5000/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Folder
```bash
curl -X POST http://localhost:5000/api/folders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Health Records",
    "parentFolder": null
  }'
```

## Common Commands

### Development
- `npm start` - Start server
- `npm run dev` - Start with nodemon (auto-reload)

### Database
- `npm run seed` - Seed initial data (if available)
- `npm run migrate` - Run migrations (if available)

## Frontend Features

### Dashboard
- Quick overview of storage status
- Recent documents
- Quick action buttons

### My Documents
- View all uploaded documents
- Search functionality
- Download/delete options
- View document metadata

### Folders
- Create and organize folders
- View nested folder structure
- Move documents between folders

### Shared with Me
- View documents shared by others
- Check permission levels
- Download shared files

### Settings
- Update profile information
- Change document type preference
- Account management

## Performance Tips

1. **Compress Large Files**: ZIP before uploading for faster transfers
2. **Use Storage Categories**: Organize by health/government/personal
3. **Regular Cleanup**: Delete old documents to manage storage
4. **Search Instead of Scroll**: Use search for quick access
5. **Folders**: Organize documents in folders for better management
