//se importan las librerias y archivos necesarios
const db = require('../services/mongoDB')
const mongo = require("mongodb")
const fs = require('fs')

/**
 * Función para crear un nuevo registro en la colección de 'reported_´post' si la publicación nunca ha sido reportado, 
 * sino actualiza el registro de esa publicación agregandole el id del usuario que la esta reportando
 * @param {*} data contiene la información para crear un nuevo registro en 'reported_post'
 */
 async function createReportedPost(data= {}) {
    const connection = await db.getConnection()
    try {
        let dbo = connection.db('helping')
        let query = {"id_post": data.id_post}
        let update = {$set:{"id_post": data.id_post,"open":true},$push:{"users": data.id_user}}
        let options = {upsert: true}
        await dbo.collection('reported_posts').updateOne(query, update, options);
    }catch (e) {
        throw e
    } finally {
        if (connection.isConnected())
            await connection.close()
    }
}


/**
 * En este método se capturan los parametros que se enviaron desde el front, para luego mandarlos por parametro al
 * método 'createReportedPost' y crear el nuevo registro o editarlo
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http
 */
 async function saveReportedPost(req, res) {
    try {
        let postReported = {
            id_user: new mongo.ObjectId(req.body.id_user),
            id_post: new mongo.ObjectId(req.body.id_post),
            open: req.body.open
        }
        await createReportedPost(postReported)
        .then(bd_res => {
            res.status(200).send('El post fue reportado exitosamente')
        })
        
    } catch(e) {
        res.status(500).send("Este post ya fue reportado")
        console.error(e)
    }
}

/**
 * Método para mostrar todos los post reportados que tienen el estado open en true
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 */
async function getReportedPosts(req, res) {
    const connection = await db.getConnection()
    try {
        let dbo = connection.db("helping")
        let cursor = dbo.collection("reported_posts").aggregate(reportedPipeline)
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

async function deleteReportedPost(req, res){
    const connection = await db.getConnection()
    try{
        let dbo = connection.db('helping')
        let id_post = mongo.ObjectId(req.params.id_post)
        console.log('id_post: ',id_post)
        dbo.collection('reported_posts').deleteOne({id_post: id_post})
        .then(bd_res => {
            dbo.collection('comments').deleteOne({id_post: id_post})
            .then(bd_res => {
                dbo.collection('posts').deleteOne({_id: id_post})
                .then(bd_res => {
                    if(bd_res.deletedCount > 0) res.status(200).send("Post eliminado correctamente")
                    else res.status(500).send("Hubo un error al eliminar el post")
                }).finally(final => {
                    if(connection.isConnected()){
                        connection.close()
                    }
                }) 
            })
        })
    } catch (e) {
        console.error(e)
        res.status(500).send("Hubo un error al eliminar el post")
    }
}

/**
 * Método para actulizar el estado del post resportado de true a false(ya no queda reportado el post)
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 */
 async function updateReportedPost(req, res) {
    const connection = await db.getConnection()
    try {
        let dbo = connection.db("helping")
        let query = {"id_post": mongo.ObjectId(req.params.id_post)}
        let update = {$set:{"open":false}};
        await dbo.collection('reported_posts').updateOne(query, update);
        console.log({query, update})
        res.status(200).send('El post fue actualizado exitosamente')
    } catch (e) {
        res.status(500).send("Hubo un error")
        console.error(e)
    } finally {
        if(connection.isConnected()){
            await connection.close()
        }
    }
}

var reportedPipeline = [
    {
      '$match': {
        'open': true
      }
    }, {
      '$lookup': {
        'from': 'posts', 
        'localField': 'id_post', 
        'foreignField': '_id', 
        'as': 'post'
      }
    }
  ]

//se exportan los métodos y funciones para usarlos despues
module.exports = {
    saveReportedPost, 
    getReportedPosts,
    deleteReportedPost,
    updateReportedPost
}
