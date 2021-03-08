const jwt = require("jsonwebtoken")
const db = require('../services/mongoDB')
const SECRET_KEY = process.env.SECRET_KEY
const md5  = require("md5")

let validate_data = (user) => {
    if (!user) {
        throw {
            ok: false,
            message: "Se debe enviar la información de usuario"
        };
    }

    if (!user.email) {
        throw {
            ok: false,
            message: "Se debe enviar el correo del usuario"
        };
    }

    if (!user.password) {
        throw {
            ok: false,
            message: "Se debe enviar la contraseña del usuario"
        };
    }
};

async function getUser(req, res) {
    const connection = await db.getConnection()

    try {
        var filter = {"email": req.email, "password": req.password}
        let dbo = connection.db('helping')
        let cursor = dbo.collection('users').find(filter)
        let values = await cursor.toArray()
        return values[0]
    } catch (e) {
        res.status(500).send('Hubo un error')
        console.log(e)
    } finally {
        if (connection.isConnected()) {
            await connection.close()
        }
    }
}

let generate_token = (user) => {
    delete user.password
    return jwt.sign(user, SECRET_KEY, {expiresIn: "1h"});
}

let decode_token = (token) => {
    return jwt.decode(token, SECRET_KEY)
}

let validate_token = (token) => {
    return jwt.verify(token, SECRET_KEY)
}

let validate_user = (req, res) => {
    try {
        let body = req.body
        validate_data(body)
        getUser(body).then((answer) => {
            if (answer) {
                let token = generate_token(body)
                res.status(200).send({
                    ok: true,
                    message: "Persona autenticada",
                    nickname: answer.nickname,
                    email: answer.email,
                    range: answer.range

                });
            } else {
                res.status(400).send({
                    ok: false,
                    message: "Correo y/o contraseña incorrecta"
                })
            }
        }).catch((error) => {
            res.status(500).send({
                "error": error,
            })
        })
    } catch (error) {
        res.status(400).send(error)
    }
}

let verify_authentication = (req, res) => {
    try {
        let token = req.headers.token;
        validate_token(token);
        res.status(200).send({
            ok: true,
            mensaje: "Autenticado.",
        });
    } catch (error) {
        res.status(400).send({
            ok: false,
            message: "No esta autenticado"
        })
    }
}

module.exports = {
    validate_data,
    getUser,
    generate_token,
    validate_token,
    decode_token,
    validate_user,
    verify_authentication
}