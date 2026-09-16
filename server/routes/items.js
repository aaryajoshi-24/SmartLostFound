const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const auth = require('../middleware/auth');

// Multer setup for optional file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'item-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed!'));
  },
});

// GET /api/items - Search and filter items
router.get('/', async (req, res) => {
  try {
    const { q, type, category, location, status } = req.query;

    const filter = {};

    // Keyword search on title or description
    if (q && q.trim()) {
      const keyword = q.trim();
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by type: lost or found
    if (type && (type === 'lost' || type === 'found')) {
      filter.type = type;
    }

    // Filter by category
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Filter by location
    if (location && location.trim()) {
      filter.location = { $regex: location.trim(), $options: 'i' };
    }

    // Filter by status: Active, Claimed, Resolved
    if (status && status !== 'All') {
      filter.status = status;
    }

    const items = await Item.find(filter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    return res.status(500).json({ message: 'Error retrieving items from database' });
  }
});

// GET /api/items/user/my-items - Get items reported by current logged-in user
router.get('/user/my-items', auth, async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id })
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error('Error fetching user items:', err);
    return res.status(500).json({ message: 'Error retrieving your reported items' });
  }
});

// GET /api/items/:id - Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.json(item);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.status(500).json({ message: 'Error retrieving item details' });
  }
});

// POST /api/items - Report a lost or found item (protected)
router.post('/', auth, upload.single('imageFile'), async (req, res) => {
  try {
    const { title, description, category, type, location, date, image } = req.body;

    // Required validation
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    if (!type || !['lost', 'found'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either lost or found' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ message: 'Location is required' });
    }
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Determine image path (file upload priority, fallback to image URL string)
    let finalImageUrl = '';
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    } else if (image && image.trim()) {
      finalImageUrl = image.trim();
    }

    const newItem = new Item({
      title: title.trim(),
      description: description.trim(),
      category,
      type,
      location: location.trim(),
      date: new Date(date),
      image: finalImageUrl,
      status: 'Active',
      reportedBy: req.user._id,
    });

    await newItem.save();
    const populated = await newItem.populate('reportedBy', 'name email');

    return res.status(201).json({
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully`,
      item: populated,
    });
  } catch (err) {
    console.error('Error creating item:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({ message: 'Server error while reporting item' });
  }
});

// PUT /api/items/:id - Update item (only reportedBy user)
router.put('/:id', auth, upload.single('imageFile'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only edit your own items' });
    }

    const { title, description, category, location, date, image, status } = req.body;

    if (title && title.trim()) item.title = title.trim();
    if (description && description.trim()) item.description = description.trim();
    if (category) item.category = category;
    if (location && location.trim()) item.location = location.trim();
    if (date) item.date = new Date(date);
    if (status && ['Active', 'Claimed', 'Resolved'].includes(status)) item.status = status;

    if (req.file) {
      item.image = `/uploads/${req.file.filename}`;
    } else if (image !== undefined) {
      item.image = image.trim();
    }

    await item.save();
    const updated = await item.populate('reportedBy', 'name email');

    return res.json({
      message: 'Item updated successfully',
      item: updated,
    });
  } catch (err) {
    console.error('Error updating item:', err);
    return res.status(500).json({ message: 'Server error while updating item' });
  }
});

// PATCH /api/items/:id/status - Manually update item status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Claimed', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Active, Claimed, or Resolved' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own items' });
    }

    item.status = status;
    await item.save();

    return res.json({
      message: `Item status updated to ${status}`,
      item,
    });
  } catch (err) {
    console.error('Error updating status:', err);
    return res.status(500).json({ message: 'Server error while updating status' });
  }
});

// DELETE /api/items/:id - Delete item (only reportedBy user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own items' });
    }

    // Delete associated claims
    await Claim.deleteMany({ itemId: item._id });

    // Delete item
    await Item.findByIdAndDelete(req.params.id);

    return res.json({ message: 'Item and associated claims deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    return res.status(500).json({ message: 'Server error while deleting item' });
  }
});

module.exports = router;
