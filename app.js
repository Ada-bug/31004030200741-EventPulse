const appConfig = require('./config/appConfig');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const app = express();

const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const swaggerUiDist = require('swagger-ui-dist');

// Swagger static assets
app.get('/api-docs/swagger-ui.css', (req, res) => {
  res.type('text/css');
  res.sendFile(
    path.join(swaggerUiDist.getAbsoluteFSPath(), 'swagger-ui.css')
  );
});

app.get('/api-docs/swagger-ui-bundle.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(
    path.join(swaggerUiDist.getAbsoluteFSPath(), 'swagger-ui-bundle.js')
  );
});

app.get('/api-docs/swagger-ui-standalone-preset.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(
    path.join(
      swaggerUiDist.getAbsoluteFSPath(),
      'swagger-ui-standalone-preset.js'
    )
  );
});

// Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// For that thing a little below
let dbStatus = 'disconnected';

// For Vercel ig
app.use(async (req, res, next) => {
  try {
    await connectDB();
    dbStatus = 'connected';
    next();
  } catch (error) {
    dbStatus = 'disconnected';
    next(error);
  }
});

// Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/events.routes');
const registrationRoutes = require('./routes/registrations.routes');
const announcementRoutes = require('./routes/announcements.routes');

// Create HTTP server from Express app
const httpServer = http.createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// Make io accessible in controllers
app.set('io', io);

// Socket.io events
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-event', (eventId) => {
    socket.join(eventId);
    console.log(`${socket.id} joined event room ${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());
app.use(express.static('public'));

// Health
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: appConfig.nodeEnv || 'development',
    uptime: process.uptime(),
    database: dbStatus,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new AppError('Route not found', 404));
});

// Error handler
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    dbStatus = 'connected';

    httpServer.listen(appConfig.port, () => {
      console.log(`Server running on port ${appConfig.port}`);
    });
  } catch (error) {
    dbStatus = 'disconnected';
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;