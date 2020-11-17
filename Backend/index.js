const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()


const app = express()

app.use(express.json())
app.use(cors())

const posts = require('./routes/post')
app.use('/post', posts)

const port = process.env.PORT
app.listen(port, () => {
    console.log("Corriendo server", port)
})

