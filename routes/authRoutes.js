const express = require('express');
const router = express.Router();
const { userRegister, userLogin } = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware');

// Upload 2 file sekaligus
router.post('/register', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'idCard', maxCount: 1 }
]), userRegister);

router.post('/login', userLogin);

module.exports = router;