const express = require('express');
const router = express.Router();
const { getMyTeam } = require('../controllers/userController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

router.get('/get-team-details', verifyAdmin, getMyTeam);

module.exports = router;