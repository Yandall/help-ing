//se importan las librerias y archivos necesarios
const db = require("../services/mongoDB");



/**
 * Función para obtener todos los registros de la colección 'types' que estan en la base de datos
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 */
async function getType(req, res) {
  const connection = await db.getConnection();
  try {
    let dbo = connection.db("helping");
    let cursor = dbo.collection("types").find({});
    let values = await cursor.toArray();
    console.log(values);
    res.status(200).send(values);
  } catch (e) {
    res.status(500).send("Hubo un error");
    console.log(e);
  } finally {
    if (connection.isConnected()) {
      await connection.close();
    }
  }
}

/**
 * Función para crear un nuevo registro en la colección de 'types'
 * @param {*} data contiene la información para crear un nuevo registro en 'types'
 */
async function createType(data) {
  const connection = await db.getConnection();
  try {
    let dbo = connection.db("helping");
    await dbo.collection("types").insertOne(data);
  } catch (e) {
    console.log(e);
  } finally {
    if (connection.isConnected()) await connection.close();
  }
}

/**
 * En este método se capturan los parametros que se enviaron desde el front, para luego mandarlos por parametro al
 * método 'createType' y crear el nuevo registro
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http
 */
async function saveType(req, res) {
  //console.log(req.body);
  try {
    let type = {
      name: req.body.name
     
    };
    await createType(type);
    res.status(200).send("tipo agregado");
  } catch (e) {
    res.status(500).send(e);
    console.error("Error al crear");
  }
}

//se exportan los métodos y funciones para usarlos despues
module.exports = {
  createType,
  saveType,
  getType,
};
