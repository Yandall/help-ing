//se importan las librerias y archivos necesarios
const db = require('../services/mongoDB')
const mongo = require("mongodb")

async function getSinglePost(req, res) {
    const connection = await db.getConnection()    
    try {
        let id = new mongo.ObjectId(req.params.id)
        let pipeline = postPipeline
        pipeline[0].$match._id = id
        let dbo = connection.db('helping')
        let cursor = dbo.collection('posts').aggregate(pipeline)
        let values = await cursor.toArray()
        res.status(200).send(values)
    } catch (err) {
        res.status(500).send("Error getting post")
    } finally {
        if (connection.isConnected())
            await connection.close()
    }
}

/**
 * Función para obtener todos los registros de la colección 'posts' que estan en la base de datos, con saltos para mostrar la información
 * por paginas
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 */
async function getPosts(req,res) {
    const connection = await db.getConnection()
    try {
        let pageNumber = req.params.page
        let topic = req.params.topic
        let nPerPage = 10
        let dbo = connection.db('helping')
        let filter = topic!="home" ? {'topic':topic.replace('_', " ")} : {}
        let cursor = dbo.collection('posts').find(filter).sort({'post_date': -1})
                .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
                .limit(nPerPage)
        let values = await cursor.toArray()
        let cantPosts = await dbo.collection('posts').countDocuments(filter)
        res.status(200).send({values, cantPosts})
    } catch (e) {
        res.status(500).send('Hubo un error')
        console.log(e)
    } finally {
        if (connection.isConnected())
            await connection.close()
    }
}

/**
 * Función para buscar y obtener los registros con un filtro que se le pasa por el body
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 */
async function searchPost(req,res) {
    const connection = await db.getConnection()
    try {
        let type = req.params.type
        let input = req.params.input
        let filter = {[type]: new RegExp(input)}
        let dbo = connection.db('helping')
        let cursor = dbo.collection('posts').find(filter).sort({'post_date': -1})
        let values = await cursor.toArray()
        res.status(200).send(values)
    } catch (e) {
        res.status(500).send('Hubo un error')
        console.log(e)
    } finally {
        if (connection.isConnected())
            await connection.close()
    }
}

/**
 * Función para crear un nuevo registro en la colección de 'posts'
 * @param {*} data contiene la información para crear un nuevo registro en 'posts'
 */
async function createPost(data= {}) {
    const connection = await db.getConnection()
    try {
        let dbo = connection.db('helping')
        data.post_date = new Date(parseInt(data.post_date, 10))
        await dbo.collection('posts').insertOne(data)
    }catch (e) {
        console.log(e)
    } finally {
        if (connection.isConnected())
            await connection.close()
    }
}

/**
 * En este método se capturan los parametros que se enviaron desde el front, para luego mandarlos por parametro al
 * método 'createPost' y crear el nuevo registro
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http
 */
async function saveFile(req, res) {
    try {
        let fileName = (req.file) ? req.file.originalname : ''
        let post = {
            title: req.body.title,
            body: req.body.body,
            tags: req.body.tags.split(','),
            author: req.body.author,
            post_date: req.body.post_date,
            file: req.body.file,
            likes : []
        }
        console.log(post.post_date)
        await createPost(post)
        res.status(200).send('Post creado')
    } catch(e) {
        res.status(500).send('Error al crear el post')
        console.error(e)
    }
}


/**
 * Esta función busca si en el arreglo de los likes de esa publicación esta el id del usuario, saca el id del arreglo(le quita el like)
 * pero si no esta agrega el id al arreglo de likes(le agrega el like). Esto permite saber cuantos likes tiene cada publicación
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 */
async function  updateLikes(req, res) {
    const connection = await db.getConnection()
    try {
        let dbo = connection.db('helping')
        console.log("idpost", req.body.id_post)
        let id_post = new mongo.ObjectID(req.body.id_post)
        let id_user = req.body.id_user
        console.log("usuario", id_user, "post", id_post)
        let result = await dbo.collection('posts').updateOne({_id: id_post},
            {$pull: {"likes": id_user}
        })
        if(result.modifiedCount == 0) {
            result = await dbo.collection('posts').updateOne({_id: id_post},
                {$push: {"likes": id_user}})
        }

        res.status(200).send("Like actualizado")
    } catch (e) {
        res.status(500).send('Hubo un error')
        console.log(e)
    } finally {
        if (connection.isConnected())
            await connection.close()
    }
}

/**
 * Pipeline necesario para obtener post con comentarios. Modificar el _id en $match para obtener info de un solo post.
 * Eliminar el [0] para obtener todos los post con todos los comentarios
 */
var postPipeline = [
    {
      '$match': {
        '_id': null
      }
    }, {
      '$lookup': {
        'from': 'comments', 
        'localField': '_id', 
        'foreignField': 'id_post', 
        'as': 'comments'
      }
    }, {
      '$unwind': {
        'path': '$comments'
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'let': {
          'id_user': '$comments.id_user'
        }, 
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$_id', '$$id_user'
                ]
              }
            }
          }, {
            '$project': {
              'nickname': 1, 
              '_id': 0
            }
          }
        ], 
        'as': 'user'
      }
    }, {
      '$unwind': {
        'path': '$user'
      }
    }, {
      '$addFields': {
        'comments.user': '$user.nickname'
      }
    }, {
      '$group': {
        '_id': '$_id', 
        'comments': {
          '$push': '$comments'
        }, 
        'title': {
          '$last': '$title'
        }, 
        'body': {
          '$last': '$body'
        }, 
        'tags': {
          '$last': '$tags'
        }, 
        'author': {
          '$last': '$author'
        }, 
        'post_date': {
          '$last': '$post_date'
        }, 
        'file': {
          '$last': '$file'
        }, 
        'likes': {
          '$last': '$likes'
        }
      }
    }
]

//se exportan los métodos y funciones para usarlos despues
module.exports = {
    getSinglePost,
    getPosts, 
    searchPost, 
    saveFile, 
    updateLikes,
}