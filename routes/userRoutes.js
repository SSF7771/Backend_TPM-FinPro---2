const express = require('express');
const router = express.Router();
const { getMyTeam } = require('../controllers/userController');

router.get('/get-team-details', getMyTeam);

module.exports = router;