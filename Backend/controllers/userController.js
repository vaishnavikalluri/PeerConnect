import User from '../models/User.js';

const normalizeUserId = (reqUser) => {
	if (reqUser && typeof reqUser === 'object') {
		return reqUser.id || reqUser._id;
	}

	return reqUser;
};

const buildProfileUpdate = (body) => {
	const allowedFields = [
		'profileImage',
		'college',
		'year',
		'location',
		'bio',
		'offeredSkills',
		'wantedSkills',
	];

	const updates = {};

	for (const field of allowedFields) {
		if (body[field] !== undefined) {
			updates[field] = body[field];
		}
	}

	return updates;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getProfile = async (req, res) => {
	try {
		const userId = normalizeUserId(req.user);

		const user = await User.findById(userId).select('-password');

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.status(200).json({ user });
	} catch (error) {
		return res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select('-password');

		return res.status(200).json({
			count: users.length,
			users,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Failed to fetch users', error: error.message });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const userId = normalizeUserId(req.user);
		const updates = buildProfileUpdate(req.body);

		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ message: 'No profile fields provided for update' });
		}

		if (updates.offeredSkills !== undefined && !Array.isArray(updates.offeredSkills)) {
			return res.status(400).json({ message: 'offeredSkills must be an array of strings' });
		}

		if (updates.wantedSkills !== undefined && !Array.isArray(updates.wantedSkills)) {
			return res.status(400).json({ message: 'wantedSkills must be an array of strings' });
		}

		const user = await User.findByIdAndUpdate(userId, updates, {
			new: true,
			runValidators: true,
		}).select('-password');

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.status(200).json({
			message: 'Profile updated successfully',
			user,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Failed to update profile', error: error.message });
	}
};

export const deleteProfile = async (req, res) => {
	try {
		const userId = normalizeUserId(req.user);
		const deletedUser = await User.findByIdAndDelete(userId).select('-password');

		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.status(200).json({
			message: 'User account deleted successfully',
			user: deletedUser,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Failed to delete profile', error: error.message });
	}
};

export const searchUsers = async (req, res) => {
	try {
		const { skill } = req.query;

		if (!skill || !skill.trim()) {
			return res.status(400).json({ message: 'skill query parameter is required' });
		}

		const regex = new RegExp(escapeRegex(skill.trim()), 'i');
		const users = await User.find({ offeredSkills: regex }).select('-password');

		return res.status(200).json({
			count: users.length,
			users,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Failed to search users', error: error.message });
	}
};
