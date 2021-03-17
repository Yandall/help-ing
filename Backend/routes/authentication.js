//se importan las librerias y archivos necesarios
const express = require("express");
const router = express.Router();
const _controller = require("../controllers/authentication")

//Middleware
router.use((req, res, next) => {
    try {
        let url = req.url
        console.log(url)
        if (url === "/") {
            next();
        } else {
            let token = req.headers.token;
            let verify = _controller.validate_token(token);
            next();
        }
    } catch (error) {
        res.status(401).send({
            ok: false,
            info: error,
            message: "No autenticado"
        })
    }
})

//endpoint para validar si el usuario que se logue si esta en la base de datos
router.post("/", _controller.validate_user)
//endpoint para validar si el token del usuario no ha expirado
router.get("/verify", _controller.verify_authentication)

module.exports = router;