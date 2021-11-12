const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8030;

//Middle Ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvbo5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tour_service');
        const packCollection = database.collection('package');
        const userCollection = database.collection('userpackage');

        // Get Service API
        app.get('/package', async (req, res) => {
            const cursor = packCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });
        // Find API
        app.get("/userpackage", async (req, res) => {
        const cursor = userCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
        });
        // Get Api by users email
        app.get("/userpackage/:email", async (req, res) => {
        const cursor = userCollection.find({ email: req.params.email });
        const orders = await cursor.toArray();
        res.send(orders);
        });
        // Api Post
        app.post("/userpackage", async (req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.json(result);
        });
    
        // Get a user data
        app.get("/userpackage/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.findOne(query);
        res.send(result);
        });

        // Update Data By User
        app.put("/userpackage/:id", async (req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
            status: updatedUser.status,
            },
        };
        const resut = await userCollection.updateOne(filter, updateDoc, options);
        res.json(resut);
        });
        
        // Delete Order
        app.delete("/userpackage/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.deleteOne(query);

        res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Assignment Server Running');
});

app.listen(port, () => {
    console.log("Example App Port", port)
});