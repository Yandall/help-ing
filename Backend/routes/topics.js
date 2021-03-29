const express = require("express");
const router = express.Router();
const topicController = require('../controllers/topics')

router.get('/', topicController.getTopic)

router.post('/saveTopic', topicController.saveTopic)

module.exports = router;
