const express = require("express");
const router = express.Router();
const _controller = require("../controllers/authentication")

//Middleware
/*
router.use((req, res, next) => {
    try {
        let url = req.url
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
*/

router.post("/", _controller.validate_user)

router.get("/verify", (req, res) => {
    try {
        let token = req.headers.token;
        let verify = _controller.validar_token(token);
        res.status(200).send({
            ok: true,
            info: verify,
            mensaje: "Autenticado.",
        });
    } catch (error) {
        res.status(400).send({
            ok: false,
            message: "No esta autenticado"
        })
    }
})

module.exports = router;