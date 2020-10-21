const express = require('express');
const router = express.Router();

// Controllers
const advertiserController = require('../controllers/advertiserController');

// Middleware
const authMiddleware = require('../middlewares/auth');
const profileImage = require('../middlewares/advertisers_pics');


// Auth routes
router.get('/', (req, res, next) => {
  return res.status(201).json({ message: "Advertisers are always happy when i'm alive." });
});
router.post('/register', advertiserController.register);
router.post('/login', advertiserController.login);
router.get('/confirm/:code', advertiserController.verify);
router.put('/:id', profileImage, advertiserController.update);

module.exports = router;