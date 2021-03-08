const express = require("express");
const router = express.Router();
const _controller = require("../controllers/authentication")

//Middleware

router.use((req, res, next) => {
    try {
        let url = req.url
        if (url === "/login") {
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


router.post("/", _controller.validate_user)

router.get("/verify", _controller.verify_authentication)

module.exports = router;