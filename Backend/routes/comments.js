//se importan las librerias y archivos necesarios
const express = require('express')
const router = express.Router()
const post_controller = require('../controllers/comments')


//endpoint para guardar el comentario 
router.post('/saveComment', post_controller.saveComment)

module.exports = router