const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let isDbConnected = false;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date(),
    service: 'Smart Lost & Found API',
  });
});

// Database connectivity check middleware for data routes
const checkDbConnection = (req, res, next) => {
  if (!isDbConnected && mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database not connected. Please ensure MongoDB is running or set MONGO_URI in server/.env',
    });
  }
  next();
};

// API Routes
app.use('/api/auth', checkDbConnection, require('./routes/auth'));
app.use('/api/items', checkDbConnection, require('./routes/items'));
app.use('/api/claims', checkDbConnection, require('./routes/claims'));
app.use('/api/dashboard', checkDbConnection, require('./routes/dashboard'));

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `API endpoint ${req.originalUrl} not found` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
});

// Seed sample data if database is fresh
async function seedInitialData() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    console.log('Seeding initial community notices and demo users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const alice = await User.create({
      name: 'Alice Johnson',
      email: 'alice@campus.edu',
      password: hashedPassword,
    });

    const bob = await User.create({
      name: 'Bob Smith',
      email: 'bob@campus.edu',
      password: hashedPassword,
    });

    const charlie = await User.create({
      name: 'Charlie Davis',
      email: 'charlie@campus.edu',
      password: hashedPassword,
    });

    const sampleItems = await Item.insertMany([
      {
        title: 'AirPods Pro with White Case',
        description: 'Found near Library 2nd floor silent study area on a wooden desk. Has a small teal sticker on the back of the charging case.',
        category: 'Electronics',
        type: 'found',
        location: 'Main Library, 2nd Floor Study Area',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
        status: 'Active',
        reportedBy: alice._id,
      },
      {
        title: 'Blue Hydro Flask Bottle (32oz)',
        description: 'Lost during Computer Science lecture in Hall B. Covered in campus coding club stickers.',
        category: 'Accessories',
        type: 'lost',
        location: 'Lecture Hall B, CS Building',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
        status: 'Active',
        reportedBy: bob._id,
      },
      {
        title: 'Student ID Card - Campus Pass',
        description: 'Found on the bench outside the student union cafeteria around lunch time.',
        category: 'Documents',
        type: 'found',
        location: 'Student Union Cafeteria Bench',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
        status: 'Active',
        reportedBy: charlie._id,
      },
      {
        title: 'Dorm Room & Bike Keyring',
        description: 'Lost keychain with 3 brass keys and an orange rubber astronaut figurine.',
        category: 'Keys',
        type: 'lost',
        location: 'North Quad Pathway near Bike Racks',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
        status: 'Active',
        reportedBy: alice._id,
      },
      {
        title: 'Grey Herschel Backpack',
        description: 'Found left behind in Chemistry Lab 304 after the 4 PM lab session.',
        category: 'Bags',
        type: 'found',
        location: 'Science Complex, Chem Lab 304',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        status: 'Active',
        reportedBy: bob._id,
      },
    ]);

    await Claim.create({
      itemId: sampleItems[0]._id,
      claimantId: bob._id,
      message: 'Hi Alice! Those AirPods might be mine. The Bluetooth name should say "Bob\'s Pods" and serial ends in 49J. Can meet at library!',
      status: 'Pending',
    });

    console.log('✅ Initial demo data seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

// Connect to MongoDB (with automatic fallback to in-memory MongoDB)
async function connectDb() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_lost_found';

  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isDbConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
  } catch (err) {
    console.warn(`Local/custom MongoDB not found. Starting automatic zero-setup MongoDB engine...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      isDbConnected = true;
      console.log(`✅ Connected to zero-setup MongoDB engine at: ${memoryUri}`);
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB:', memErr.message);
      isDbConnected = false;
    }
  }

  if (isDbConnected) {
    await seedInitialData();
  }
}

// Start Express Server
app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`🚀 Smart Lost & Found Server running on port ${PORT}`);
  console.log(`👉 API Health: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
  await connectDb();
});
