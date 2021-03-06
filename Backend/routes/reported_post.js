//se importan las librerias y archivos necesarios
const express = require('express')
const router = express.Router()
const reportedPost_controller = require('../controllers/reported_post')

//endpoint para guardar el post reportado
router.post('/saveReportedPost', reportedPost_controller.saveReportedPost)
//endpoint para obtener todos los post reportados
router.get('/', reportedPost_controller.getReportedPosts)
router.delete('/:id_post', reportedPost_controller.deleteReportedPost)
//endpoint para actualizar el post reportado
router.post('/:id_post', reportedPost_controller.updateReportedPost)

module.exports = router