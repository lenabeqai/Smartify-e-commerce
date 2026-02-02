const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/', dashboardController.dashboard);


module.exports = router;