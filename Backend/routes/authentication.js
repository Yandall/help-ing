const express = require("express");
const router = express.Router();
const _controller = require("../controllers/authentication")

//Middleware
router.use((req, res, next) =>{
    try{
        let url = req.url
        if (url === "/login"){
            next();
        }else{
            let token = req.headers.token;
            let verify = _controller.validate_token(token);
            next();
        }
    }catch (error){
        res.status(401).send({
            ok: false,
            info: error,
            message: "No autenticado"
        })
    }
})

router.post("login", (req, res) =>{
    try{
        let body = req.body
        _controller.validate_data(body)
        _controller.getUser(body).then((answer) =>{
            let usuario = answer
            if(usuario){
                let token = _controller.generate_token(usuario)
                res.status(200).send({
                    ok: true,
                    info: token,
                    message: "Persona autenticada"
                });
            }else{
                res.status(400).send({
                    ok: false,
                    info: {},
                    message: "Correo y/o contraseña incorrecta"
                })
            }
        }).catch((error) =>{
            res.status(500).send(error)
        })
    }catch (error){
        res.status(400).send(error)
    }
})