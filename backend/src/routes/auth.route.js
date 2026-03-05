import express from 'express';
import { signup, login , logout, updateProfile } from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';
import { forgotPassword, resetPassword } from '../controllers/auth.controllers.js';

const router = express.Router();

// router.use(arcjetProtection);

// router.get('/test',arcjetProtection, (req,res) => {
//     res.status(200).json({message: "Test route accessed successfully"});
// });
router.post('/signup',signup);
router.post('/login', login);
router.post('/logout', logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.put("/update-profile",protectRoute, updateProfile);

router.get("/check",protectRoute, (req,res) => res.status(200).json(req.user));

export default router;