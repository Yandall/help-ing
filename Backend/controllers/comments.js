//se importan las librerias y archivos necesarios
const db = require('../services/mongoDB')
const mongo = require("mongodb")
const fs = require('fs')


/**
 * Función para crear un nuevo registro en la colección de 'comments'
 * @param {*} data contiene la información para crear un nuevo registro en 'comments'
 */
 async function createComment(data= {}) {
    const connection = await db.getConnection()
    try {
        let dbo = connection.db('helping')
        data.date = new Date(parseInt(data.date, 10))
        await dbo.collection('comments').insertOne(data)
    }catch (e) {
        console.log(e)
    } finally {
        if (connection.isConnected())
            await connection.close()
    }
}


/**
 * En este método se capturan los parametros que se enviaron desde el front, para luego mandarlos por parametro al
 * método 'createComment' y crear el nuevo registro
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http
 */
 async function saveComment(req, res) {
    try {
        let fileName = (req.file) ? req.file.originalname : ''
        let post = {
            id_user: req.body.id_user,
            id_post: req.body.id_post,
            date: req.body.date,
            comment: req.body.comment
        }
        console.log(post.date)
        await createComment(post)
        res.status(200).send('Comment creado')
    } catch(e) {
        res.status(500).send('Error al crear el comment')
        console.error(e)
    }
}



//se exportan los métodos y funciones para usarlos despues
module.exports = {
    saveComment, 
}