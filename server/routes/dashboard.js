const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Claim = require('../models/Claim');

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalLost,
      totalFound,
      resolvedOrClaimed,
      activeReports,
      totalClaims,
      categoryStats,
      recentItems,
    ] = await Promise.all([
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: { $in: ['Claimed', 'Resolved'] } }),
      Item.countDocuments({ status: 'Active' }),
      Claim.countDocuments(),
      Item.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]),
      Item.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('reportedBy', 'name email'),
    ]);

    const categories = {
      Electronics: 0,
      Documents: 0,
      Accessories: 0,
      Bags: 0,
      Clothing: 0,
      Keys: 0,
      Other: 0,
    };

    categoryStats.forEach((c) => {
      if (categories[c._id] !== undefined) {
        categories[c._id] = c.count;
      }
    });

    return res.json({
      totalLost,
      totalFound,
      resolvedOrClaimed,
      activeReports,
      totalClaims,
      categoryBreakdown: categories,
      recentItems,
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    return res.status(500).json({ message: 'Error retrieving dashboard statistics' });
  }
});

module.exports = router;
