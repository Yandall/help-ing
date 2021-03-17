//Se importan las librerias y archivos necesarios
const express = require("express");
const router = express.Router();
const user_controller = require('../controllers/user');
const multer = require('multer')

var storage = multer.diskStorage({
  destination: '../Frontend/static/users/',
  filename(req, file, cb) {
      cb(null, file.originalname)
  }

})

var upload = multer({ storage: storage,
  fileFilter(req, file, next) {
      const isPhoto = file.mimetype.startsWith('image/');
      if (isPhoto) {
          next(null, true);
      } else {
          next({message: "Formato no valido solo puedes adjuntar imagenes"}, false);
      }
  } })

//endpoint para guardar un usuario
router.post('/saveUser', upload.single('file'), user_controller.saveUser)

module.exports = router;
