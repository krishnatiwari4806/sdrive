# Advanced Configuration Guide

## MongoDB Setup

### Local MongoDB
1. Download MongoDB Community Edition
2. Install and run MongoDB service
3. Update `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/document-storage
   ```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/document-storage?retryWrites=true&w=majority
   ```

## AWS S3 Configuration for File Storage

### Prerequisites
- AWS Account
- IAM user with S3 permissions

### Setup Steps

1. **Create S3 Bucket**
   - Go to AWS S3 Console
   - Create new bucket (e.g., `document-storage-prod`)
   - Block all public access
   - Enable versioning

2. **Create IAM User**
   - Go to IAM Console
   - Create new user
   - Attach policy: `AmazonS3FullAccess`
   - Create access keys

3. **Update .env**
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_S3_BUCKET=document-storage-prod
   AWS_REGION=us-east-1
   ```

4. **Update Backend Code**
   Replace file storage logic with S3 upload in `routes/documents.js`

## Environment Variables Reference

### Development
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/document-storage
JWT_SECRET=dev_secret_key_change_me
JWT_EXPIRE=7d
```

### Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=VERY_SECURE_SECRET_KEY_MIN_32_CHARS
JWT_EXPIRE=30d
CORS_ORIGIN=https://yourdomain.com
AWS_ACCESS_KEY_ID=prod_key
AWS_SECRET_ACCESS_KEY=prod_secret
AWS_S3_BUCKET=prod-bucket
AWS_REGION=us-east-1
```

## Security Hardening

### 1. HTTPS/SSL
```bash
# Using Let's Encrypt with Nginx
sudo certbot certonly --standalone -d yourdomain.com
```

### 2. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

### 3. CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### 4. Input Validation
```javascript
const { body, validationResult } = require('express-validator');

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Continue...
});
```

## Deployment Options

### 1. Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### 2. DigitalOcean
```bash
# Create droplet with Node.js
# SSH into droplet
ssh root@your_ip

# Install dependencies
apt-get update
apt-get install nodejs npm mongodb

# Clone repository
git clone your_repo_url
cd document-cloud-storage/backend

# Install packages
npm install

# Start with PM2
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### 3. Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t document-storage .
docker run -p 5000:5000 -e MONGODB_URI=... -d document-storage
```

## Performance Optimization

### 1. Database Indexing
```javascript
// In Document model
documentSchema.index({ owner: 1, createdAt: -1 });
documentSchema.index({ 'tags': 1 });
```

### 2. Caching
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache user documents
app.get('/documents', protect, async (req, res) => {
  const cached = await client.get(`docs_${req.userId}`);
  if (cached) return res.json(JSON.parse(cached));
  
  const docs = await Document.find({ owner: req.userId });
  await client.setex(`docs_${req.userId}`, 3600, JSON.stringify(docs));
  res.json(docs);
});
```

### 3. Pagination
```javascript
router.get('/documents', protect, async (req, res) => {
  const page = req.query.page || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  
  const docs = await Document.find({ owner: req.userId })
    .limit(limit)
    .skip(skip);
  
  const total = await Document.countDocuments({ owner: req.userId });
  
  res.json({
    docs,
    total,
    pages: Math.ceil(total / limit)
  });
});
```

### 4. Compression
```javascript
const compression = require('compression');
app.use(compression());
```

## Monitoring & Logging

### Winston Logger
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('Document uploaded', { userId, docId });
```

### Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
```

## Backup & Recovery

### MongoDB Backup
```bash
# Backup
mongodump --uri "mongodb://localhost:27017/document-storage"

# Restore
mongorestore --uri "mongodb://localhost:27017/document-storage" dump/
```

### AWS S3 Backup
```bash
# Enable versioning (already done)
# Enable MFA Delete protection
# Set lifecycle policies for older versions
```

## Scaling Considerations

1. **Horizontal Scaling**: Use load balancer (Nginx, HAProxy)
2. **Database**: Use MongoDB replica set for high availability
3. **Caching**: Implement Redis for session/data caching
4. **CDN**: Use CloudFront for static assets
5. **Message Queue**: Implement Bull for async tasks

## Troubleshooting Production Issues

### High Memory Usage
```bash
# Check process memory
ps aux | grep node

# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=2048" npm start
```

### Database Connection Failures
```bash
# Monitor connection pool
db.currentOp() # in MongoDB
```

### Slow API Responses
```bash
# Add monitoring
const slow = require('express-slow-down');
const speedLimiter = slow.speedLimiter({ windowMs: 15 * 60 * 1000, delayAfter: 100, delayMs: 500 });
app.use(speedLimiter);
```
