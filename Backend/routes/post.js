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

var upload = multer({ storage: storage })

router.get('/', post_controller.getPosts)
//router.post('/create', post_controller.createPost)
router.post('/saveFile', upload.single('file'), post_controller.saveFile)

module.exports = router