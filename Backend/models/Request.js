import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: ['Pending', 'Accepted', 'Rejected'],
			default: 'Pending',
		},
		createdAt: {
			type: Date,
			default: Date.now,
			immutable: true,
		},
	},
	{
		versionKey: false,
	}
);

requestSchema.index({ sender: 1, receiver: 1, status: 1 });

const Request = mongoose.model('Request', requestSchema);

export default Request;
