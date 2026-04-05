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

const allowedOrigins = [
  'https://shivaniphotoandfilms.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
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

app.use('/api/auth', authRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/services', require('./routes/services'));
app.use('/api/gallery', require('./routes/gallery'));

// Root path health check indicating the API is live
app.get('/', (req, res) => {
  res.json({ status: "Live", message: "Shivani Photo & Films API is running" });
});

const PORT = process.env.PORT || 5000;

connectDB();

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
