// example from https://www.mongodb.com/docs/drivers/node/current/quick-start/#create-your-node.js-application

const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
// Replace the uri string with your connection string.
dotenv.config();
// console.log(process.env)
const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;
const uri =
  `mongodb+srv://${db_username}:${db_password}@${db_url}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);