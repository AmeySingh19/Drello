const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const boardRoutes = require('./routes/board');
const columnRoutes = require('./routes/column');
const taskRoutes = require('./routes/task');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Task Board API is running');
});

app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

