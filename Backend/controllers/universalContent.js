//se importan las librerias y archivos necesarios
const db = require("../services/mongoDB");



/**
 * Función para obtener todos los registros de la colección 'universal_contents' que estan en la base de datos
 * @param {*} req  petición enviada desde el front
 * @param {*} res  contiene la respuesta de la petición http 
 */
async function getUC(req, res) {
  const connection = await db.getConnection();
  try {
    let dbo = connection.db("helping");
    let cursor = dbo.collection("universal_contents").find({});
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
 * Función para crear un nuevo registro en la colección de 'Universal_contents'
 * @param {*} data contiene la información para crear un nuevo registro en 'universal_contents'
 */
async function createUC(data) {
  const connection = await db.getConnection();
  try {
    let dbo = connection.db("helping");
    await dbo.collection("universal_contents").insertOne(data);
  } catch (e) {
    console.log(e);
  } finally {
    if (connection.isConnected()) await connection.close();
  }
}

/**
 *En este método se capturan los parametros que se enviaron desde el front, para luego mandarlos por parametro al
 *método 'createUC' y crear el nuevo registro
 * @param {*} req petición enviada desde el front
 * @param {*} res contiene la respuesta de la petición http 
 */
async function saveUC(req, res) {
  //console.log(req.body);
  try {
    let uc = {
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      file: req.file.originalname,
      type: req.body.type,
      icon: req.body.icon,
    };
    await createUC(uc);
    res.status(200).send("Contenido agregado");
  } catch (e) {
    res.status(500).send(e);
    console.error("Error al crear");
  }
}

//se exportan los métodos y funciones para usarlos despues
module.exports = {
  getUC,
  createUC,
  saveUC,
};
