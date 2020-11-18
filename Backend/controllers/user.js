const db = require('../services/mongoDB')

async function getUser (req,res)  {
    const connection = await db.getConnection()
    try{
        var filter = {'email ' : req.email}
        let dbo = connection.db('helping')
        let cursor = dbo.collection('users').find(filter)
        let values = cursor.toArray()
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

async function saveFile(req, res) {
    try {
        let user = {
            nickname: req.body.nickname,
            password: req.body.password,
            email: req.body.email,
            range: req.body.range,
            image: req.file.originalname
        }
        console.log(post.post_date)
        await createUser(user)
        res.status(200).send('Post creado')
    } catch(e) {
        res.status(500).send('Error al crear el post')
        console.error(e)
    }

}

module.exports = {
    getUser, createUser, saveFile
}