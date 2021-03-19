//se importan las librerias y archivos necesarios 
const jwt = require("jsonwebtoken")
const db = require('../services/mongoDB')
const SECRET_KEY = process.env.SECRET_KEY
const md5  = require("md5")

/**
 * Método para validar que la información del usuario este completa
 * @param {*} user contiene los datos del usuario que se esta logueando
 */
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


/**
 * Función para validar si el usuario que se esta logueando esta registrado en la Base de Datos 
 * @param {*} req  petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 * @returns retorna el usuario que encontró en la BD
 */
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


/**
 * Método para generar el Json Web token y eliminar el campo de contraseña del usuario que se esta logueando, para que este no sea visible
 * @param {*} user contiene la información del usuario que se esta logueando
 * @returns token generado
 */
let generate_token = (user) => {
    delete user.password
    return jwt.sign(user, SECRET_KEY, {expiresIn: "1h"});
}

/**
 * Decodifica el token a una forma mas legible(formato Json)
 * @param {*} token que ya se genero
 * @returns Json 
 */
let decode_token = (token) => {
    return jwt.decode(token, SECRET_KEY)
}

/**
 * Usa el token generado y la SECRECT_KEY para validar si el token fue generado con esa misma SECRECT_KEY
 * @param {*} token que ya se genero
 * @returns Falso o Verdadero
 */
let validate_token = (token) => {
    return jwt.verify(token, SECRET_KEY)
}


/**
 * En este método se llama el metodo getUSer que valida si el usuario que se esta logueando esta registrado en la BD,
 * si esta registrado se genera el token para ese usuario y se autentica para que pueda navegar por la aplicación, si la contraseña
 * o el usuario no coinciden con lo que esta registrado en la BD se le muestra una alarma al usuario diciendole que alguno de estos campos
 * estan incorrectos y no se permite loguear al usuario
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 */
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
                    range: answer.range,
                    _id: answer._id,
                    image: answer.image,
                    token : token

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

/**
 * Metodo para validar si el token no ha expirado y el usuario sigue logueado
 * @param {*} req  petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http
 */
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


//se eportan los métodos y funciones para poder utilizarlos luego
module.exports = {
    validate_data,
    getUser,
    generate_token,
    validate_token,
    decode_token,
    validate_user,
    verify_authentication
}