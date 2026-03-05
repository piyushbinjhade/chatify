import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import friendRoutes from "./routes/friend.route.js";

import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import arcjetProtection from "./middleware/arcjet.middleware.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(arcjetProtection);


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friends", friendRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});


server.listen(PORT, () => {
  console.log("Server running on port : " + PORT);
  connectDB();
});