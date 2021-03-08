const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()


const app = express()

app.use(express.json())
app.use(cors())

const posts = require('./routes/post')
const users = require('./routes/users')
const uc = require(('./routes/universalContent'))
const types = require('./routes/types')
const authentication = require('./routes/authentication')

app.use('/post', posts)
app.use('/users', users)
app.use('/uc', uc)
app.use('/types', types)
app.use('/login', authentication)

const port = process.env.PORT
app.listen(port, () => {
    console.log("Corriendo server", port)
})

