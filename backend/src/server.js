import express from 'express'; 
import path from 'path';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import cors from 'cors';

app.use(cors({
  origin: "https://chatify-1-pwpu.onrender.com", // your frontend URL
  credentials: true
}));

const app = express()
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json())  // req.body

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



app.listen(PORT, ()=> {
    console.log("Server running on port : " + PORT)
    connectDB();
});