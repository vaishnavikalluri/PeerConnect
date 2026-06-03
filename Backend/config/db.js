import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

		if (!mongoUri) {
			throw new Error('MongoDB connection string is missing');
		}

		await mongoose.connect(mongoUri);
		console.log('MongoDB Connected');
	} catch (error) {
		console.error('MongoDB connection error:', error.message);
		throw error;
	}
};

export default connectDB;
