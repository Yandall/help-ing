//se importan las librerias y archivos necesarios
const db = require('../services/mongoDB')

/**
 * Función para crear un nuevo registro en la colección 'users'
 * @param {*} data contiene la información para crear un nuevo registro en la colección 'users'
 */
async function createUser(data) {
    const connection = await db.getConnection()
    try {
        let dbo = connection.db('helping')
        await dbo.collection('users').insertOne(data)
    }catch (e) {
        throw e
    } finally {
        if (connection.isConnected())
            await connection.close()
    }

}

/**
 * En este método se capturan los parametros que se enviaron desde el front, para luego mandarlos por parametro al
 * método 'createUser' y crear el nuevo registro
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 */
async function saveUser(req, res) {
     //console.log(req.body);
    try {
        let user = {
            nickname: req.body.nickname,
            password: req.body.password,
            email: req.body.email,
            range: parseInt(req.body.range),
            image: req.file.originalname
        }
        await createUser(user)
        res.status(200).send('Usuario creado')
    } catch(e) {
        res.status(500).send("Erorr, usuario ya existente")
        console.error("Error al crear")
        console.log(e)
    }

}

//se eportan los métodos y funciones para poder utilizarlos luego
module.exports = {
    saveUser
}