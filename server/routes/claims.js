const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// POST /api/claims - Submit a claim for a found item
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, message } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Claim message or proof description is required' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.type !== 'found') {
      return res.status(400).json({ message: 'Claims can only be filed on found items' });
    }

    // A reporter cannot claim their own found item
    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot submit a claim on an item you reported' });
    }

    // Check if user already has a pending claim on this item
    const existingClaim = await Claim.findOne({
      itemId,
      claimantId: req.user._id,
      status: 'Pending',
    });

    if (existingClaim) {
      return res.status(400).json({ message: 'You already have an active pending claim for this item' });
    }

    const claim = new Claim({
      itemId,
      claimantId: req.user._id,
      message: message.trim(),
      status: 'Pending',
    });

    await claim.save();
    const populated = await claim.populate([
      { path: 'claimantId', select: 'name email' },
      { path: 'itemId', select: 'title type status location' },
    ]);

    return res.status(201).json({
      message: 'Claim request submitted successfully',
      claim: populated,
    });
  } catch (err) {
    console.error('Error creating claim:', err);
    return res.status(500).json({ message: 'Server error while submitting claim' });
  }
});

// GET /api/claims/item/:itemId - Get all claims for a specific item (for reporter) or user's claim
router.get('/item/:itemId', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const isReporter = item.reportedBy.toString() === req.user._id.toString();

    let query = { itemId: req.params.itemId };
    if (!isReporter) {
      // Non-reporters can only see their own claim for this item
      query.claimantId = req.user._id;
    }

    const claims = await Claim.find(query)
      .populate('claimantId', 'name email')
      .populate('itemId', 'title type status')
      .sort({ createdAt: -1 });

    return res.json({
      isReporter,
      claims,
    });
  } catch (err) {
    console.error('Error fetching item claims:', err);
    return res.status(500).json({ message: 'Server error while fetching claims' });
  }
});

// GET /api/claims/my-claims - Get claims submitted by the logged-in user
router.get('/my-claims', auth, async (req, res) => {
  try {
    const claims = await Claim.find({ claimantId: req.user._id })
      .populate('itemId')
      .sort({ createdAt: -1 });

    return res.json(claims);
  } catch (err) {
    console.error('Error fetching user claims:', err);
    return res.status(500).json({ message: 'Server error while fetching your claims' });
  }
});

// PATCH /api/claims/:id/approve - Approve a claim (only item reporter)
router.patch('/:id/approve', auth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('itemId');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const item = await Item.findById(claim.itemId._id || claim.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Associated item not found' });
    }

    // Only the reporter can approve
    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Only the item reporter can approve claims' });
    }

    // Approve this claim
    claim.status = 'Approved';
    await claim.save();

    // Set item status to 'Claimed'
    item.status = 'Claimed';
    await item.save();

    // Automatically reject other pending claims on this item
    await Claim.updateMany(
      {
        itemId: item._id,
        _id: { $ne: claim._id },
        status: 'Pending',
      },
      {
        $set: { status: 'Rejected' },
      }
    );

    const updatedClaim = await Claim.findById(claim._id)
      .populate('claimantId', 'name email')
      .populate('itemId', 'title status type');

    return res.json({
      message: 'Claim approved successfully and item marked as Claimed. Other pending claims were rejected.',
      claim: updatedClaim,
      item,
    });
  } catch (err) {
    console.error('Error approving claim:', err);
    return res.status(500).json({ message: 'Server error while approving claim' });
  }
});

// PATCH /api/claims/:id/reject - Reject a claim (only item reporter)
router.patch('/:id/reject', auth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('itemId');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const item = await Item.findById(claim.itemId._id || claim.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Associated item not found' });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Only the item reporter can reject claims' });
    }

    claim.status = 'Rejected';
    await claim.save();

    const updatedClaim = await Claim.findById(claim._id)
      .populate('claimantId', 'name email')
      .populate('itemId', 'title status type');

    return res.json({
      message: 'Claim rejected',
      claim: updatedClaim,
    });
  } catch (err) {
    console.error('Error rejecting claim:', err);
    return res.status(500).json({ message: 'Server error while rejecting claim' });
  }
});

module.exports = router;
