const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0x1dg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanics");
        const serviceCollections = database.collection("services");
        //GET API
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollections.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })
        //GET Single API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollections.findOne(query);
            res.send(service)
        })
        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hitted the post API', service)
            const result = await serviceCollections.insertOne(service);
            console.log(result);
            res.json(result);
        })
        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollections.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Genius Car Mechanics Server')
})

app.listen(port, () => {
    console.log('Running on port:', port)
})