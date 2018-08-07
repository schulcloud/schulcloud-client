const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authentication');

// secure routes
router.use(authHelper.authChecker);

router.get('/', function (req, res, next) {
    res.render('clipboard/clipboard');
});

module.exports = router;
