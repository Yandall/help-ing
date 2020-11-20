const db = require("../services/mongoDB");

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

async function saveUC(req, res) {
  console.log(req.body);
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

module.exports = {
  getUC,
  createUC,
  saveUC,
};
