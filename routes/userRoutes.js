const express = require('express');
const router = express.Router();
const { getMyTeam } = require('../controllers/userController');
const { verifyUser } = require("../middlewares/authMiddleware");

router.use(verifyUser);

router.get('/get-team-details', getMyTeam);

module.exports = router;