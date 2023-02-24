import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import express from "express";
// link to connect and filter by property type, bedrooms and beds
// http://localhost:3000/findOne?property_type=Apartment&bedrooms=2&beds=2
dotenv.config();
// console.log(process.env)
const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;
// Replace the uri string with your connection string.
const uri =
    `mongodb+srv://${db_username}:${db_password}@${db_url}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
const app = express();
app.set('port', process.env.PORT || 3000)
app.get('/findOne', async (req,res) => {
    try {
        const database = client.db('sample_airbnb');
        const listings = database.collection('listingsAndReviews');
        const filter = {};

        if (req.query.property_type) {
            filter.property_type = req.query.property_type;
        }
        if (req.query.bedrooms) {
            filter.bedrooms = parseInt(req.query.bedrooms);
        }
        if (req.query.beds) {
            filter.beds = parseInt(req.query.beds);
        }

        const projection = {
            id: 1,
            listing_url: 1,
            name: 1,
            summary: 1,
            property_type: 1,
            bedrooms: 1,
            beds: 1
        };
        const listing = await listings.findOne(filter, {projection: projection});
        res.type('json');
        res.status(200);
        res.json(listing);
        // res.json({
        //     id: 1, listing_url: 1, property_type: 1, bedrooms: 1, beds: 1
        // });

    } catch (error) {
        console.log(error)
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});


app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started');
});


