const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');

dotenv.config();

async function seedData() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_lost_found';

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await User.deleteMany({});
    await Item.deleteMany({});
    await Claim.deleteMany({});

    // Create demo users
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

    console.log('Users created: Alice, Bob, Charlie (password: password123)');

    // Create sample items
    const items = [
      {
        title: 'AirPods Pro with White Case',
        description: 'Found near the Library 2nd floor silent study area on a wooden desk. Has a small teal sticker on the back of the charging case.',
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
        description: 'Lost during Computer Science lecture in Hall B. Has campus coding club stickers all over.',
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
        description: 'Found left behind in the Chemistry Lab 304 after the 4 PM session.',
        category: 'Bags',
        type: 'found',
        location: 'Science Complex, Chem Lab 304',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        status: 'Active',
        reportedBy: bob._id,
      },
      {
        title: 'Calculus III Spiral Notebook',
        description: 'Black cover Five-Star notebook with handwritten lecture notes and exam formula sheets.',
        category: 'Documents',
        type: 'lost',
        location: 'Math Building Room 102',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        status: 'Resolved',
        reportedBy: charlie._id,
      },
    ];

    const createdItems = await Item.insertMany(items);
    console.log(`Created ${createdItems.length} sample items.`);

    // Create a sample claim on the AirPods
    await Claim.create({
      itemId: createdItems[0]._id,
      claimantId: bob._id,
      message: 'Hi Alice! Those AirPods might be mine. The name set on Bluetooth should say "Bob\'s Pods" and the serial number ends in 49J. I can verify when we meet!',
      status: 'Pending',
    });
    console.log('Created sample claim for testing!');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();
