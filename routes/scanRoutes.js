// // ============================================
// // routes/scanRoutes.js
// // ============================================


const express = require('express');
const router = express.Router();
const multer = require('multer');
const scanController = require('../controllers/scanController');
const { authenticateToken } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/image', authenticateToken, upload.single('image'), scanController.scanWithImage);
router.post('/text', authenticateToken, scanController.scanWithText);
router.get('/history', authenticateToken, scanController.getScanHistory);
router.get('/:id', authenticateToken, scanController.getScanById);

module.exports = router;