const express = require('express');
const router = express.Router();
const { getMyTeam } = require('../controllers/userController');

const { verifyUser } = require('../middlewares/authMiddleware');

router.get('/get-team-details', verifyUser, getMyTeam);

module.exports = router;