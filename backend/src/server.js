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
  origin: "https://shivani-photo-and-films.vercel.app", // Your Vercel link
  credentials: true
}));
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://shivani-photo-and-films.vercel.app",
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

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Handle client-side routing
app.get([/(.*)/], (_req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

connectDB();

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

