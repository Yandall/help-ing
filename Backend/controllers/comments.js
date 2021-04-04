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
        let date = new Date(parseInt(req.body.date, 10))
        let post = {
            id_user: new mongo.ObjectId(req.body.id_user),
            id_post: new mongo.ObjectId(req.body.id_post),
            date: date,
            comment: req.body.comment
        }
        await createComment(post)
        .then(bd_res => {
            res.status(200).send('Comentario creado')
        })
        
    } catch(e) {
        res.status(500).send('Su comentario no pudo ser creado, por favor intentelo de nuevo')
        console.error(e)
    }
}


/**
 * Método para filtrar los comentarios que pertenecen a un post
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 */
async function getComments(req, res) {
    const connection = await db.getConnection()
    try {
        let dbo = connection.db("helping")
        let filter = {"id_post": req.params.id_post};
        let cursor = dbo.collection("comments").find(filter)
        let values = await cursor.toArray()
        res.status(200).send(values)
    } catch (e) {
        res.status(500).send("Hubo un error")
        console.error(e)
    } finally {
        if(connection.isConnected()){
            await connection.close()
        }
    }

}

//se exportan los métodos y funciones para usarlos despues
module.exports = {
    saveComment, 
    getComments
}