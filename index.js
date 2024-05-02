import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
