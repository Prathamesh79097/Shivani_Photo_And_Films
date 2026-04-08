require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const inquiryRoutes = require('./routes/inquiries');

const app = express();
const http = require('http');
const { Server } = require('socket.io');

app.use(cors({
  origin: true, // Allow any frontend Vercel URL dynamically
  credentials: true
}));
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/services', require('./routes/services'));
app.use('/api/gallery', require('./routes/gallery'));

// Backend is set up as a pure API.
const PORT = process.env.PORT || 5000;

connectDB();

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

