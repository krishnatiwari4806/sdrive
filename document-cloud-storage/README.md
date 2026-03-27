# Document Cloud Storage System

A secure, full-featured web application for storing, organizing, and sharing health and government documents in the cloud. Built with Node.js, Express, MongoDB, and modern web technologies.

## Features

### Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Document Management**: Upload, organize, and manage documents
- **Folder Organization**: Create folders and organize documents hierarchically
- **Document Sharing**: Share documents with other users with granular permission controls
- **Access Permissions**: View, edit, and download permission levels
- **Search Functionality**: Quick search across documents by name, description, or tags
- **Storage Management**: Track storage usage with visual indicators

### Security Features
- Password encryption with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- User isolation (users can only access their own documents)
- Secure file handling

### Document Types
- Personal Documents
- Health Documents
- Government Documents

## Project Structure

```
document-cloud-storage/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── Folder.js
│   │   └── Share.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── documents.js
│   │   ├── folders.js
│   │   └── sharing.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── .env
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/document-storage
   JWT_SECRET=your_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_S3_BUCKET=your-document-storage-bucket
   AWS_REGION=us-east-1
   MAX_FILE_SIZE=52428800
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup

The frontend is served directly from the backend at `http://localhost:5000`. Simply navigate to this URL in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Documents
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document details
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Folders
- `GET /api/folders` - List all folders
- `POST /api/folders` - Create new folder
- `PUT /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder

### Sharing
- `POST /api/sharing/document` - Share document with user
- `POST /api/sharing/folder` - Share folder with user
- `GET /api/sharing/shared-with-me` - Get documents shared with me
- `DELETE /api/sharing/:docId/user/:userId` - Revoke share

## Usage

### Registration
1. Click "Register" on the login page
2. Enter your name, email, password, and select document type
3. Click "Register"

### Login
1. Enter your email and password
2. Click "Login"

### Uploading Documents
1. Click "Upload Document" or the "Upload" button
2. Select a file from your computer (drag & drop supported)
3. Add description, select folder, document type, and tags
4. Click "Upload"

### Creating Folders
1. Click "Create Folder" or go to Folders section
2. Enter folder name and select parent folder (optional)
3. Click "Create"

### Sharing Documents
1. Go to Sharing section
2. Select document to share
3. Enter recipient's email
4. Choose permission level (View, Edit, Download)
5. Click "Share"

### Searching Documents
1. Use the search box in the top bar
2. Search by document name, description, or tags
3. Results update in real-time

## Configuration

### AWS S3 Integration (Optional)
To enable AWS S3 for file storage:

1. Create AWS account and set up S3 bucket
2. Get Access Key ID and Secret Access Key
3. Configure in `.env`:
   ```env
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_S3_BUCKET=your_bucket_name
   AWS_REGION=us-east-1
   ```

### MongoDB Setup
- **Local**: Ensure MongoDB is running on `mongodb://localhost:27017`
- **Atlas Cloud**: Update `MONGODB_URI` in `.env`:
  ```env
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/document-storage
  ```

## Security Considerations

1. **Change JWT_SECRET**: Set a strong, unique secret in production
2. **HTTPS**: Use HTTPS in production
3. **CORS**: Configure CORS allowed origins
4. **Rate Limiting**: Consider adding rate limiting for API endpoints
5. **Input Validation**: Validate all user inputs
6. **File Upload**: Implement file type restrictions and virus scanning

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB credentials if using Atlas

### CORS Errors
- Frontend and backend must be able to communicate
- Check backend URL in frontend code
- Ensure CORS is enabled in Express

### Authentication Issues
- Clear browser localStorage: `localStorage.clear()`
- Check JWT_SECRET is set correctly
- Verify token expiration settings

## Future Enhancements

- [ ] AWS S3 file upload integration
- [ ] Document versioning and history
- [ ] Advanced permission sharing
- [ ] Document encryption
- [ ] Activity logging and audit trails
- [ ] Two-factor authentication
- [ ] Mobile app
- [ ] Email notifications
- [ ] Document preview (PDF, images)
- [ ] Export to different formats

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please contact the development team.

## Deployment

### Production Deployment

#### Using Heroku
1. Create Heroku account and install Heroku CLI
2. Create new app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set`
4. Deploy: `git push heroku main`

#### Using AWS/GCP/Azure
Refer to respective cloud provider documentation for Node.js app deployment.

## Development Notes

- Frontend is a single-page application (SPA)
- Backend API follows RESTful conventions
- Database uses Mongoose ODM for MongoDB
- Authentication uses JWT tokens
- All timestamps in ISO 8601 format

---

Built with ❤️ for secure document storage
