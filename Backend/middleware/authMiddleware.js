import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'Not authorized, token missing' });
		}

		const token = authHeader.split(' ')[1];
		const jwtSecret = process.env.JWT_SECRET;

		if (!jwtSecret) {
			return res.status(500).json({ message: 'JWT_SECRET is not configured' });
		}

		const decoded = jwt.verify(token, jwtSecret);
		req.user = { id: decoded.id };

		return next();
	} catch (error) {
		return res.status(401).json({ message: 'Not authorized, token failed' });
	}
};

export default protect;
