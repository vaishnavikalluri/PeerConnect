import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testRoutes from './routes/testRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.json({ message: 'PeerConnect Backend Running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use("/api/test", testRoutes);


const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDB();

		app.listen(PORT, () => {
			console.log(`Server Running on PORT ${PORT}`);
		});
	} catch (error) {
		console.error('Server startup error:', error.message);
		process.exit(1);
	}
};

startServer();
