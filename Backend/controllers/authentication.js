const jwt = require("jsonwebtoken")
const db = require('../services/mongoDB')
const SECRET_KEY = process.env.SECRET_KEY

let validate_data = (user) =>{
    if(!user){
        throw {
            ok: false,
            message: "Se debe enviar la información de usuario"
        };
    }

    if(!user.email){
        throw {
            ok: false,
            message: "Se debe enviar el correo del usuario"
        };
    }

    if (!user.password){
        throw {
            ok: false,
            message: "Se debe enviar la contraseña del usuario"
        };
    }
};

let getUser = async (req,res) =>  {
    const connection = await db.getConnection()
    try{
        var filter = {"email" : req.params.email ,"password" : req.params.password}
        let dbo = connection.db('helping')
        let cursor =  dbo.collection('users').find(filter)
        let values = await cursor.toArray()
        return values
    }catch(e) {
        res.status(500).send('Hubo un error')
        console.log(e)
    }finally{
        if(connection.isConnected()){
            await connection.close()
        }
    };
};

let generate_token = (user) =>{
    delete user.password
    let token = jwt.sign(user, SECRET_KEY, {expiresIn: "1h"});
    return token
}

let decode_token = (token) =>{
    return jwt.decode(token, SECRET_KEY)
}

let validate_token = (token) =>{
    return jwt.verify(token, SECRET_KEY)
}
module.exports = {
    validate_data,
    getUser,
    generate_token,
    validate_token,
    decode_token,
}