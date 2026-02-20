import express from 'express'; 
import path from 'path';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import arcjetProtection from './middleware/arcjet.middleware.js';
import { app, server } from './lib/socket.js';

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" }))  // req.body
app.use(cookieParser())
app.use(cors({
  origin: ENV.CLIENT_URL, // your frontend URL
  credentials: true
}));

app.use(arcjetProtection);
// if (ENV.NODE_ENV === "production") {
//   app.use(arcjetProtection);
// }


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// // make ready for deployment
// if (ENV.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../frontend/dist')));

//     // Catch-all middleware for SPA routing (React Router)
//     app.use((req, res, next) => {
//         if (req.path.startsWith('/api')) return next(); // Skip API routes
//         res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
//     });
// }

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});



server.listen(PORT, ()=> {
    console.log("Server running on port : " + PORT)
    connectDB();
});