const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const app = express();
const PORT = 3600;

app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/DBProject'; // Replace with your MongoDB URI
const dbName = 'DBProject'; // Replace with your database name
const collectionName = 'DB-Project'; // Replace with your collection name

let db;

// Connect to MongoDB
MongoClient.connect(mongoURI, (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');
    db = client.db(dbName);
});

// Get all items
app.get('/items', async (req, res) => {
    try {
        const items = await db.collection(collectionName).find({}).toArray();
        res.json(items);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get an item by ID
app.get('/items/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const item = await db.collection(collectionName).findOne({ _id: ObjectID(itemId) });
        if (!item) {
            res.status(404).send('Item not found');
        } else {
            res.json(item);
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create a new item
app.post('/items', async (req, res) => {
    try {
        const newItem = req.body;
        const result = await db.collection(collectionName).insertOne(newItem);
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update an item by ID
app.put('/items/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const updatedItem = req.body;
        await db.collection(collectionName).updateOne({ _id: ObjectID(itemId) }, { $set: updatedItem });
        res.status(200).send('Item updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete an item by ID
app.delete('/items/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        await db.collection(collectionName).deleteOne({ _id: ObjectID(itemId) });
        res.status(200).send('Item deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
