const express = require("express");
const router = express.Router();
const topicController = require('../controllers/topics')

router.get('/', topicController.getTheme)

router.post('/saveTheme', topicController.saveTheme)

module.exports = router;
