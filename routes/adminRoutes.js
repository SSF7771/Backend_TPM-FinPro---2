const express = require('express');
const router = express.Router();
const { getAllTeams, getTeamById, updateTeam, deleteTeam } = require('../controllers/adminController');
const { verifyAdmin } = require('../middlewares/adminMiddleware');

// Untuk memastikan bahwa benar akun adalah admin
router.use(verifyAdmin);

router.get('/teams', getAllTeams);
router.get('/get-team/:id', getTeamById);
router.put('/update-team/:id', updateTeam);
router.delete('/delete-team/:id', deleteTeam);

module.exports = router;