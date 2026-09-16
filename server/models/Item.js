const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Electronics', 'Documents', 'Accessories', 'Bags', 'Clothing', 'Keys', 'Other'],
      message: '{VALUE} is not a valid category',
    },
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: {
      values: ['lost', 'found'],
      message: 'Type must be either lost or found',
    },
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  image: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Active', 'Claimed', 'Resolved'],
    default: 'Active',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reported by user reference is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', itemSchema);
