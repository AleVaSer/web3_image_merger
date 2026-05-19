const express = require('express');
const router = new express.Router();
const middleware = require('../middleware/contractor');
const controller = require('../controller/controller');
const validator = require('../middleware/validator');

router.get('/token/:id',
    validator.checkTokenId,
    middleware.checkCachedPng,
    middleware.getToken,
    controller.mergeImage
);

module.exports = router;