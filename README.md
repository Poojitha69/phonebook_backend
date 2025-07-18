# 📡 Backend API Documentation

This document provides comprehensive information about the phonebook backend API, including setup, endpoints, authentication, and development guidelines.

## 🏗️ Architecture Overview

The backend is built with Node.js and Express.js, following a modular architecture:

```
backend/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   ├── authController.js   # Authentication business logic
│   └── contactController.js # Contact CRUD operations
├── middleware/
│   └── authMiddleware.js   # JWT authentication middleware
├── models/
│   ├── User.js            # User data model
│   └── Contact.js         # Contact data model
├── routes/
│   ├── authRoutes.js      # Authentication endpoints
│   └── contactRoutes.js   # Contact management endpoints
├── server.js              # Express server configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Quick Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   JWT_SECRET=your_secure_jwt_secret_here
   MONGODB_URI=mongodb://localhost:27017/phonebook
   ```

3. **Start MongoDB:**
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

4. **Start the Server:**
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user account.

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

**Response (400 - User exists):**
```json
{
  "msg": "User exists"
}
```

#### POST `/api/auth/login`
Authenticate an existing user.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

**Response (400 - Invalid credentials):**
```json
{
  "msg": "Invalid credentials"
}
```

### Contact Management Endpoints

All contact endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

#### GET `/api/contacts`
Retrieve all contacts for the authenticated user.

**Request:**
```http
GET /api/contacts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "phone": "+1234567890",
    "user": "507f1f77bcf86cd799439011"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Jane Smith",
    "phone": "+0987654321",
    "user": "507f1f77bcf86cd799439011"
  }
]
```

**Response (401 - Unauthorized):**
```json
{
  "msg": "No token, auth denied"
}
```

#### POST `/api/contacts`
Create a new contact.

**Request:**
```http
POST /api/contacts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "New Contact",
  "phone": "+1234567890"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "New Contact",
  "phone": "+1234567890",
  "user": "507f1f77bcf86cd799439011"
}
```

#### PUT `/api/contacts/:id`
Update an existing contact.

**Request:**
```http
PUT /api/contacts/507f1f77bcf86cd799439014
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Updated Contact",
  "phone": "+0987654321"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "Updated Contact",
  "phone": "+0987654321",
  "user": "507f1f77bcf86cd799439011"
}
```

#### DELETE `/api/contacts/:id`
Delete a contact.

**Request:**
```http
DELETE /api/contacts/507f1f77bcf86cd799439014
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "msg": "Deleted"
}
```

## 🗄️ Database Models

### User Model
```javascript
{
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}
```

**Features:**
- Email validation and uniqueness
- Password hashing with bcrypt (10 salt rounds)
- Automatic password hashing on save

### Contact Model
```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
}
```

**Features:**
- User association for data isolation
- Required name and phone fields
- Automatic user assignment on creation

## 🔐 Authentication

### JWT Implementation
- **Algorithm:** HS256
- **Secret:** Configurable via JWT_SECRET environment variable
- **Payload:** User ID (`{ id: user._id }`)
- **Token Format:** Bearer token in Authorization header

### Password Security
- **Hashing:** bcrypt with 10 salt rounds
- **Pre-save Hook:** Automatic password hashing
- **Comparison:** Secure password verification

### Middleware Protection
```javascript
// Example of protected route
router.get('/contacts', auth, getContacts);
```

## 🛠️ Development

### Project Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Development Server
```bash
npm run dev
```
Uses nodemon for automatic server restart on file changes.

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `JWT_SECRET` | JWT signing secret | Required |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/phonebook` |

### Error Handling
The API uses standard HTTP status codes:

- **200:** Success
- **400:** Bad Request (validation errors)
- **401:** Unauthorized (missing/invalid token)
- **500:** Internal Server Error

### CORS Configuration
```javascript
app.use(cors());
```
Configured for development. Update for production with specific origins.

## 🧪 Testing

### Manual Testing with cURL

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Get Contacts (with token)
```bash
curl -X GET http://localhost:3000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Add Contact
```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","phone":"+1234567890"}'
```

## 🔒 Security Considerations

### Input Validation
- Email format validation
- Password strength requirements
- Contact data sanitization

### Authentication Security
- JWT token expiration (configurable)
- Secure token storage
- Password hashing with salt

### Database Security
- User data isolation
- Input sanitization
- MongoDB injection prevention

## 🚀 Deployment

### Production Environment
1. **Set Environment Variables:**
   ```env
   PORT=3000
   JWT_SECRET=your_very_secure_secret_key
   MONGODB_URI=mongodb://your-production-db-url
   ```

2. **Install Dependencies:**
   ```bash
   npm install --production
   ```

3. **Start Server:**
   ```bash
   npm start
   ```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   ```
   Error: Failed to connect to MongoDB
   ```
   **Solution:** Ensure MongoDB is running and connection string is correct.

2. **JWT Token Invalid:**
   ```
   Error: Token not valid
   ```
   **Solution:** Check JWT_SECRET environment variable and token format.

3. **Port Already in Use:**
   ```
   Error: listen EADDRINUSE :::3000
   ```
   **Solution:** Change PORT environment variable or kill existing process.

4. **CORS Errors:**
   ```
   Error: CORS policy blocked request
   ```
   **Solution:** Update CORS configuration for your frontend domain.

### Debug Mode
```bash
DEBUG=* npm start
```

### Logs
Server logs include:
- MongoDB connection status
- Server startup confirmation
- Request/response logging (in debug mode)

## 📝 API Versioning

Current API version: v1

All endpoints are prefixed with `/api/` for future versioning support.

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update documentation for new endpoints
5. Test thoroughly before submitting

---

**For more information, see the main project README.** #   p h o n e b o o k _ b a c k e n d  
 