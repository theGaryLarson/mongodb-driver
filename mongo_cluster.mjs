import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
// link to connect and filter by property type, bedrooms and beds
// http://localhost:3000/findOne?property_type=Apartment&bedrooms=2&beds=2
dotenv.config();

const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;

const app = express();
app.use(cors());
app.use(express.json());
app.set('port', process.env.PORT || 3000)

const uri = `mongodb+srv://${db_username}:${db_password}@${db_url}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


app.post('/findOne', async (req,res) => {
    const { database, collection, filter, projection } = req.body;
    let connection;
    try {
        connection = await client.connect();
        const db = client.db(database);
        const col = db.collection(collection);
        // for (const field in filter) {
        //     if (req.filter.hasOwnProperty(field)) {
        //         if (field === 'bedrooms' ||
        //             field === 'beds' ||
        //             field === 'minimum_nights' ||
        //             field === 'maximum_nights') {
        //             filter[field] = parseInt(req.query[field]);
        //         } else {
        //             filter[field] = req.query[field];
        //         }
        //     }
        // }
        const result = await col.findOne(filter, { projection });
        res.status(200);
        res.json(result);
    } catch (error) {
        console.log(error)
        res.status(500).send('Error fetching data')
    } finally {
        // Ensures that the client's connection will close when you exit the program
        if (connection) {
            // optimize: for multiple users its good to maintain an always open connection.
            await connection.close();
        }
    }
});


app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

const PORT = app.get('port');
app.listen(app.get('port'), () => {
    console.log(`Express started on port ${PORT}`);
});


app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
})


