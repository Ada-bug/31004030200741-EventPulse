const appConfig = require("./config/appConfig");

const express = require('express');
const morgan  = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const app = express();

// Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/events.routes');
const registrationRoutes = require('./routes/registrations.routes')

// Run before routes
app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes)
app.use('/api/registrations', registrationRoutes);
// more routes will be mounted here later

app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port}`);
  });
}

start();