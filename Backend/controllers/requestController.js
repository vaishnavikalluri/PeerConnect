import mongoose from 'mongoose';
import Request from '../models/Request.js';
import User from '../models/User.js';
import { sendEmail } from "../services/emailService.js";


const getUserId = (reqUser) => {
	if (reqUser && typeof reqUser === 'object') {
		return reqUser.id || reqUser._id;
	}

	return reqUser;
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const sendRequest = async (req, res) => {
	try {
		const senderId = getUserId(req.user);
		const { receiverId } = req.body;

		if (!receiverId) {
			return res.status(400).json({ message: 'receiverId is required' });
		}

		if (!isValidObjectId(receiverId)) {
			return res.status(400).json({ message: 'receiverId is invalid' });
		}

		if (String(senderId) === String(receiverId)) {
			return res.status(400).json({ message: 'You cannot send a request to yourself' });
		}

		const existingPendingRequest = await Request.findOne({
			sender: senderId,
			receiver: receiverId,
			status: 'Pending',
		});

		if (existingPendingRequest) {
			return res.status(409).json({ message: 'Pending request already exists' });
		}

		await Request.create({
			sender: senderId,
			receiver: receiverId,
			status: 'Pending',
		});
		const sender = await User.findById(senderId);
		const receiver = await User.findById(receiverId);
		await sendEmail(
			receiver.email,
			"New Collaboration Request 🤝",
			`
  				<h2>New Collaboration Request</h2>
 				 <p>${sender.name} wants to collaborate with you.</p>
 				 <p>Login to PeerConnect to accept or reject the request.</p>
 			`
		);

		return res.status(201).json({ message: 'Request sent successfully' });
	} catch (error) {
		return res.status(500).json({ message: 'Failed to send request', error: error.message });
	}
};

export const getSentRequests = async (req, res) => {
	try {
		const senderId = getUserId(req.user);
		const requests = await Request.find({ sender: senderId })
			.populate('receiver', 'name email')
			.select('receiver status createdAt');

		return res.status(200).json({
			count: requests.length,
			requests,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Failed to fetch sent requests', error: error.message });
	}
};

export const getReceivedRequests = async (req, res) => {
	try {
		const receiverId = getUserId(req.user);
		const requests = await Request.find({ receiver: receiverId })
			.populate('sender', 'name email')
			.select('sender status createdAt');

		return res.status(200).json({
			count: requests.length,
			requests,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Failed to fetch received requests', error: error.message });
	}
};

export const acceptRequest = async (req, res) => {
	try {
		const receiverId = getUserId(req.user);
		const { requestId } = req.params;

		if (!isValidObjectId(requestId)) {
			return res.status(400).json({ message: 'requestId is invalid' });
		}

		const request = await Request.findById(requestId);

		if (!request) {
			return res.status(404).json({ message: 'Request not found' });
		}

		if (String(request.receiver) !== String(receiverId)) {
			return res.status(403).json({ message: 'Only the receiver can accept this request' });
		}

		if (request.status !== 'Pending') {
			return res.status(400).json({ message: 'Only pending requests can be accepted' });
		}

		request.status = 'Accepted';
		await request.save();


		const sender = await User.findById(request.sender);
const receiver = await User.findById(request.receiver);
		await sendEmail(
  sender.email,
  "Collaboration Request Accepted ✅",
  `
  <h2>Good News!</h2>
  <p>${receiver.name} accepted your collaboration request.</p>
  <p>You can now connect through PeerConnect Chat.</p>
  `
);

		return res.status(200).json({ message: 'Request accepted' });
	} catch (error) {
		return res.status(500).json({ message: 'Failed to accept request', error: error.message });
	}
};

export const rejectRequest = async (req, res) => {
	try {
		const receiverId = getUserId(req.user);
		const { requestId } = req.params;

		if (!isValidObjectId(requestId)) {
			return res.status(400).json({ message: 'requestId is invalid' });
		}

		const request = await Request.findById(requestId);

		if (!request) {
			return res.status(404).json({ message: 'Request not found' });
		}

		if (String(request.receiver) !== String(receiverId)) {
			return res.status(403).json({ message: 'Only the receiver can reject this request' });
		}

		if (request.status !== 'Pending') {
			return res.status(400).json({ message: 'Only pending requests can be rejected' });
		}

		request.status = 'Rejected';
		await request.save();

const sender = await User.findById(request.sender);
const receiver = await User.findById(request.receiver);

		await sendEmail(
  sender.email,
  "Collaboration Request Update",
  `
  <h2>Request Update</h2>
  <p>${receiver.name} declined your collaboration request.</p>
  <p>You can continue exploring other collaborators on PeerConnect.</p>
  `
);

		return res.status(200).json({ message: 'Request rejected' });
	} catch (error) {
		return res.status(500).json({ message: 'Failed to reject request', error: error.message });
	}
};
