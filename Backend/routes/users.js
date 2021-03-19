//Se importan las librerias y archivos necesarios
const express = require("express");
const router = express.Router();
const user_controller = require('../controllers/user');

//endpoint para guardar un usuario
router.post('/createUser', user_controller.createUser)

module.exports = router;
