import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { deleteProfile, getAllUsers, getProfile, searchUsers, updateProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.get('/all', protect, getAllUsers);
router.put('/profileUpdate', protect, updateProfile);
router.delete('/profileDelete', protect, deleteProfile);
router.get('/search', protect, searchUsers);

export default router;
