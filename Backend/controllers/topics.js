const db = require('../services/mongoDB')

async function getTheme(req, res) {
    const connection = await db.getConnection()
    try {
        let dbo = connection.db("helping")
        let cursor = dbo.collection("topics").find({})
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


async function createTheme(data){
    const connection = await db.getConnection()
    try{
        let dbo = connection.db('helping')
        await dbo.collection("topics").insertOne(data)
    } catch(e){
        console.error(e)
    }finally{
        if(connection.isConnected()) await connection.close()
    }
}

async function saveTheme(req, res){
    try{
        let theme = {
            name: req.body.name
        }
        await createTheme(theme)
        res.status(200).send('Tema agregado')
    }catch(e){
        res.status(500).send("Error al crear")
    }
}

module.exports ={
    createTheme,
    saveTheme,
    getTheme
}