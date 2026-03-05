import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET, NODE_ENV} = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d", // Token validity
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Accessible only by web server
    sameSite: "strict", // CSRF protection
    secure: NODE_ENV === "production",
  });

  return token;
};
