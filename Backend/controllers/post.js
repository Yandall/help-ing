const db = require('../services/mongoDB')
const fs = require('fs')

async function getPosts(req,res) {
    const connection = await db.getConnection()
    try {
        let pageNumber = req.params.page
        let nPerPage = 5
        let filter = ''
        filter = filter === '' ? ({}) : filter
        let dbo = connection.db('helping')
        let cursor = dbo.collection('posts').find(filter)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage)
        let values = await cursor.toArray()
        let cantPosts = await dbo.collection('posts').countDocuments({})

        res.status(200).send({values, cantPosts})
    } catch (e) {
        res.status(500).send('Hubo un error')
        console.log(e)
    } finally {
        if (connection.isConnected())
            await connection.close()
    }
}

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

async function saveFile(req, res) {
    try {
        let post = {
            title: req.body.title,
            body: req.body.body,
            tags: req.body.tags.split(','),
            author: req.body.author,
            post_date: req.body.post_date,
            file: req.file.originalname
        }
        console.log(post.post_date)
        await createPost(post)
        res.status(200).send('Post creado')
    } catch(e) {
        res.status(500).send('Error al crear el post')
        console.error(e)
    }

}

module.exports = {
    getPosts, saveFile
}