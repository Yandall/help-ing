//se importan las librerias y archivos necesarios
const express = require('express')
const router = express.Router()
const comment_controller = require('../controllers/comments')

////endpoint para obtener todos los comments de un post
router.get('/:id_post', comment_controller.getComments)
//endpoint para guardar el comentario 
router.post('/saveComment', comment_controller.saveComment)

module.exports = router