const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

// Controllers
const accountController = require('../controllers/accountController');
const preferenceController = require('../controllers/preferenceController');
const advertisers = require('./advertisers');

// Middleware
const authMiddleware = require('../middlewares/auth');
const multerImages = require('../middlewares/multer_images');

// CORS Middleware
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Parse request body
router.use(bodyParser.json({ strict: false }));
router.use(bodyParser.urlencoded({ extended: false }));

router.use('/advertisers', advertisers);

router.get('/', (req, res, next) => {
    return res.json({ app: 'MaxAds API', version: 'v1.0.0' });
});

// Auth routes
router.get('/check-registration/:prefix/:phone', accountController.checkRegistration);
router.post('/check-code', accountController.verify);
router.post('/auth', accountController.auth);

// Preferences routes
router.get('/preferences/:prefix/:phone', preferenceController.show);
router.post('/preferences/:prefix/:phone', preferenceController.store);
router.post('/preferences/:prefix/:phone/avatar', multerImages, preferenceController.avatar);

// Accounts routes
router.get('/accounts/:prefix/:phone/exists', accountController.exists);

module.exports = router;