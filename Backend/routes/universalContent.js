const express = require("express");
const router = express.Router();
const ucController = require('../controllers/universalContent');
const multer = require('multer')

var storage = multer.diskStorage({
  destination: '../Frontend/static/universalContents/',
  filename(req, file, cb) {
      cb(null, file.originalname)
  }

})

var upload = multer({ storage: storage })

router.get('/', ucController.getUC)
router.post('/saveUC', upload.single('file'), ucController.saveUC)

module.exports = router;
