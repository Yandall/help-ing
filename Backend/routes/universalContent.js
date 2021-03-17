//se importan las librerias y archivos necesarios
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

//endpoint para obtener todos los registros de contenido universal
router.get('/', ucController.getUC)
//endpoint para guardar un registro en contenido universal
router.post('/saveUC', upload.single('file'), ucController.saveUC)

module.exports = router;
