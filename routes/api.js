const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const accountController = require('../controllers/accountController');
const preferenceController = require('../controllers/preferenceController');

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

router.get('/', (req, res, next) => {
    return res.json({ app: 'MaxAds API', version: 'v1.0.0' });
});

// Registration routes
router.get('/check-registration/:phone', accountController.checkRegistration);
router.get('/check-code/:code', accountController.verify);

// Preferences routes
router.get('/preferences/:phone', preferenceController.show);
router.post('/preferences/:phone', preferenceController.store);

module.exports = router;