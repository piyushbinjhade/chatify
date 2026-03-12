# Chatify

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## Features
- **Real-time Messaging**: Instant communication powered by Socket.io
- **User Authentication**: Secure login and authorization using JWT & Bcrypt
- **Image Sharing**: Seamless media uploads via Cloudinary
- **Modern UI**: Sleek, responsive design built with React, Tailwind CSS (v4), and DaisyUI
- **State Management**: Efficient and localized state handling using Zustand
- **Security**: Hardened API with Arcjet, Helmet, and CORS configuration

## Tech Stack
### Frontend
- React 19 (Vite)
- Tailwind CSS v4 & DaisyUI
- Socket.io-client
- Zustand
- React Router
- Axios
- Lucide React (Icons)

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Socket.io for Real-time Websockets
- JWT & Bcrypt for Auth
- Cloudinary & Multer for Media Handle
- Arcjet & Helmet for API Security

## Prerequisites
To run this application, you need to have the following installed/configured:
- **Node.js**: (v18+ recommended)
- **MongoDB**: A running local or cloud MongoDB database
- **Cloudinary Account**: For media uploads
- **Arcjet Account**: Optional, but used in project for API security

## Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory with the following keys. **(Replace the values with your actual credentials.)**

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Arcjet Setup
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

# Emailing
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### Frontend (`frontend/.env.local`)
Create a `.env.local` file in the `frontend` directory with the basic API URL:

```env
VITE_API_URL=http://localhost:3000
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/piyushbinjhade/chatify.git
   cd chatify-app
   ```

2. **Install dependencies**
   You can install both backend and frontend dependencies using the root `package.json` build script, or navigate and install them individually:
   ```bash
   # From the root directory:
   npm run build
   
   # Or manually:
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Run the application (Development)**
   
   To start the **backend server**:
   ```bash
   cd backend
   npm run dev
   ```

   To start the **frontend server**:
   ```bash
   cd frontend
   npm run dev
   ```

   Both servers need to run simultaneously. The backend typically runs on port `3000`, the frontend on port `5173`.

## Deployment
If you wish to deploy the system, the root folder has standard scripts:
- `npm run build`: Executes installation across both frontend/backend and triggers the frontend build via Vite.
- `npm start`: Initiates the production backend Node server.

