const express = require('express');
const router = express.Router({ mergeParams: true });
const authHelper = require('../helpers/authentication');

// secure routes
router.use(authHelper.authChecker);

router.get('/', function (req, res, next) {
    res.render('clipboard/clipboard', {
        noFooter: true,
        courseId: req.params.courseId
    });
});

module.exports = router;
