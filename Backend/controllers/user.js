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
async function createUser(req, res) {
    const connection = await db.getConnection()
    try {
        console.log(req.body)
        let user = {
            nickname: req.body.nickname,
            password: req.body.password,
            email: req.body.email,
            range: parseInt(req.body.range),
            image: req.body.file
        }
        console.log(user)
        let dbo = connection.db('helping')
        await dbo.collection('users').insertOne(user)
        res.status(200).send('Usuario creado')
    } catch(e) {
        res.status(500).send("Erorr al crear usuario")
        console.error("Error al crear")
        console.log(e)
    } finally {
        if (connection.isConnected())
            await connection.close()
    }
    

}

//se eportan los métodos y funciones para poder utilizarlos luego
module.exports = {
    createUser
}