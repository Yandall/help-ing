const {MongoClient} = require('mongodb')
const uri = process.env.DB_URI

/**
 *  Returns a connection to the database
 * @returns {Promise<MongoClient>}
 */
async function getConnection() {
    let client = new MongoClient(uri)
    return await client.connect()
}

module.exports = {
    getConnection
}