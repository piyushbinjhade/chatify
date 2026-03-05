import nodemailer from "nodemailer";
import { ENV } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

export const sendResetEmail = async (email, resetLink) => {
    await transporter.sendMail({
        from: `"Chatify" <${ENV.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Password",
        html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
        `,
    });
};