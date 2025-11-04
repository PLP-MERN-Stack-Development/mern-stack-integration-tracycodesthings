const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const blogRoutes = require('./routes/blog.js');
const { errorHandler } = require("./middleware/errorHandler.js");
const category = require('./models/category.js');

// Load environment variables first
dotenv.config();

const app = express();

// CORS configuration - must come BEFORE routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/blogs', blogRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('API is on http://localhost:' + PORT));