const db = require('../services/mongoDB')
const md5 = require("md5")


async function createUser(data) {
    const connection = await db.getConnection()
    try {
        let dbo = connection.db('helping')
        await dbo.collection('users').insertOne(data)
    }catch (e) {
        console.log(e)
    } finally {
        if (connection.isConnected())
            await connection.close()
    }

}

async function saveUser(req, res) {
    console.log(req.body)
    try {
        let user = {
            nickname: req.body.nickname,
            password: md5(req.body.password),
            email: req.body.email,
            range: parseInt(req.body.range),
            image: req.file.originalname
        }
        await createUser(user)
        res.status(200).send('Usuario creado')
    } catch(e) {
        res.status(500).send(e)
        console.error("Error al crear")
        console.log(e)
    }

}

module.exports = {
    saveUser, createUser
}