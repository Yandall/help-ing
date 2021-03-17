//se importan las librerias y archivos necesarios
const express = require('express')
const router = express.Router()
const post_controller = require('../controllers/post')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: '../Frontend/static/posts/',
    filename(req, file, cb) {
        cb(null, file.originalname)
    }

})

var upload = multer({ storage: storage,
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        const isPdf = file.mimetype.startsWith('application/pdf');
        if (isPhoto || isPdf) {
            next(null, true);
        } else {
            next({message: "Formato no valido solo puedes adjuntar imagenes o pdf"}, false);
            console.log("Intentaste subir un archivo invalido mmgvo")
        }
    } })

////endpoint para obtener todas las publicaciones
router.get('/:page', post_controller.getPosts)
//endpoint para obtener solo las publicaciones filtradas
router.get('/:type/:input', post_controller.searchPost)
//endpoint para guardar la publicación 
router.post('/saveFile', upload.single('file'), post_controller.saveFile)
//endpoint para actualizar los likes de la publicación
router.post(('/updateLikes'), post_controller.updateLikes)

module.exports = router