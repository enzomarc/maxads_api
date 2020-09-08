const express = require('express');
const router = express.Router();

// Controllers
const advertiserController = require('../controllers/advertiserController');

// Middleware
const authMiddleware = require('../middlewares/auth');
const multerImages = require('../middlewares/multer_images');


// Auth routes
router.get('/', (req, res, next) => {
  console.log("Called advertisers");
  return res.status(201).json({ message: "A new message for nothing." });
});
router.post('/register', advertiserController.register);
router.post('/login', advertiserController.login);

module.exports = router;