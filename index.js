import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import authRouter from './routes/auth.routes.js';

dotenv.config();

// create express app
const app = express();

// connect to database
connectDB();

// middlewares
app.use(express.json());

const port = process.env.PORT || 3000;

// routes
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use('/api/auth', authRouter);

// error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
