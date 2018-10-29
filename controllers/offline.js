const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('offline/offline', {
    title: 'Offline',
    });
});

module.exports = router;
