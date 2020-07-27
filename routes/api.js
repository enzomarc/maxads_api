const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const accountController = require('../controllers/accountController');

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

router.get('/users/:phone/exists', accountController.exists);
router.post('/sms/:phone', accountController.sendSMS);

module.exports = router;