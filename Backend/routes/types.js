//se importan las librerias y archivos necesarios
const express = require("express");
const router = express.Router();
const typeController = require('../controllers/types');


////endpoint para obtener todos los tipos
router.get('/', typeController.getType)
//endpoint para guardar un nuevo tipo 
router.post('/saveType', typeController.saveType)

module.exports = router;
