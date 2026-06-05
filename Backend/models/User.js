import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		profileImage: {
			type: String,
			default: '',
		},
		college: {
			type: String,
			default: '',
		},
		year: {
			type: String,
			default: '',
		},
		location: {
			type: String,
			default: '',
		},
		bio: {
			type: String,
			default: '',
		},
		offeredSkills: {
			type: [String],
			default: [],
		},
		wantedSkills: {
			type: [String],
			default: [],
		},
		createdAt: {
			type: Date,
			default: Date.now,
			immutable: true,
		},
	},
);

const User = mongoose.model('User', userSchema);

export default User;
