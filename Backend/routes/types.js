const express = require("express");
const router = express.Router();
const typeController = require('../controllers/types');


router.get('/', typeController.getType)
router.post('/saveType', typeController.saveType)

module.exports = router;
