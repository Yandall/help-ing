const db = require("../services/mongoDB");

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

async function saveType(req, res) {
  console.log(req.body);
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

module.exports = {
  createType,
  saveType,
  getType,
};
