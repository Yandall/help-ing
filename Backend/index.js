//se importan las librerias y archivos necesarios
const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()


const app = express()

app.use(express.json())
app.use(cors())

//Se crean los endpoints con las respectivas rutas
const posts = require('./routes/post')
const users = require('./routes/users')
const uc = require(('./routes/universalContent'))
const types = require('./routes/types')
const authentication = require('./routes/authentication')
const topics = require('./routes/topics')
const comments = require('./routes/comments')

//Se usan los endpoints
app.use('/post', posts)
app.use('/users', users)
app.use('/uc', uc)
app.use('/types', types)
app.use('/login', authentication)
app.use('/topics', topics)
app.use('/comments', comments)

//Se asigna el puerto a la aplicación
const port = process.env.PORT
app.listen(port, () => {
    console.log("Corriendo server", port)
})

