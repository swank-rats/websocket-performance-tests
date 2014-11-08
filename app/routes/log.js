var express = require('express'),
    router = express.Router(),
    log = require('../services/log');

/* GET / */
router.get('/', log.express.controlPanel());

module.exports = router;
