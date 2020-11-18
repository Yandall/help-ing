//Se importan las librerias y archivos necesarios
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const db = require("../services/mongo_conection");
const user_controller = require('../controllers/user');
const { route } = require("./post");

var storage = multer.diskStorage({
  destination: '../Frontend/static/users/',
  filename(req, file, cb) {
      cb(null, file.originalname)
  }

})

var upload = multer({ storage: storage })

router.get('/', user_controller.getUsers)
router.post('/saveFile', upload.single('file'), user_controller.saveFile)






module.exports = router;
