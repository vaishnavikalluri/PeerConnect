import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
	acceptRequest,
	getReceivedRequests,
	getSentRequests,
	rejectRequest,
	sendRequest,
} from '../controllers/requestController.js';

const router = express.Router();

router.post('/send', protect, sendRequest);
router.get('/sent', protect, getSentRequests);
router.get('/received', protect, getReceivedRequests);
router.put('/accept/:requestId', protect, acceptRequest);
router.put('/reject/:requestId', protect, rejectRequest);

export default router;
