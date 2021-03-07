const db = require('../services/mongoDB')

async function getUser (req,res)  {
    const connection = await db.getConnection()
    try{
        var filter = {"email" : req.params.email ,"password" : req.params.password}
        let dbo = connection.db('helping')
        let cursor =  dbo.collection('users').find(filter)
        let values = await cursor.toArray()
        console.log(values)
        res.status(200).send(values)
    }catch(e) {
        res.status(500).send('Hubo un error')
        console.log(e)
    }finally{
        if(connection.isConnected()){
            await connection.close()
        }
    }
}

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
    }

}

module.exports = {
    getUser, saveUser, createUser
}