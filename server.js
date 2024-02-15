const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// Connection URL
const connectionURL = "mongodb+srv://ajayalagesan:Ajay%405510@cluster0.ujy7xqk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true });
const dbNname = 'shopify-timer'
// Connect to the MongoDB database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB database");

    // Once connected, you can perform database operations here

  } catch (error) {
    console.error("Error connecting to MongoDB database:", error);
  }
}

// Middleware to connect to the database before any route handling
app.use(async (req, res, next) => {
  await connectToDatabase();
  req.dbClient = client;
  req.db = client.db(dbNname); // Get the database object
  next();
});

// Define your routes here
app.get('/', async (req, res) => {
  // Example: Query documents from a collection
  const collection = req.db.collection('label');
  const documents = await collection.find({}).toArray();
  res.json(documents);
});         

app.get('/:id', async (req, res) => {
  try {
    const db = req.db;
    const collection = db.collection('label');
    
    // Extract the id parameter from the URL
    const id = req.params.id;

    // If id is not provided or invalid, send a 400 Bad Request status
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id parameter" });
    }

    // Convert the id string to an ObjectId
    const objectId = new ObjectId(id);

    // Query the specific document based on the ObjectId
    const document = await collection.findOne({ _id: objectId });

    // If document is found, send it as a response
    if (document) {
      res.json(document);
    } else {
      // If document is not found, send 404 Not Found status
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    // Handle errors appropriately
    console.error("Error retrieving data from MongoDB:", error);
    res.status(500).json({ error: "An error occurred while retrieving data from MongoDB" });
  }
});

app.get('/getLabel', async (req, res) => {
  try {
    
    const db = req.db;
    const collection = db.collection('label');
    
    // Extract the id query parameter from the URL
    const id = req.query.id;

    // If id is not provided or invalid, send a 400 Bad Request status
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id parameter" });
    }

    // Convert the id string to an ObjectId
    const objectId = new ObjectId(id);

    // Query the specific document based on the ObjectId
    const document = await collection.findOne({ _id: objectId });

    // If document is found, send it as a response
    if (document) {
      res.json(document);
    } else {
      // If document is not found, send 404 Not Found status
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    // Handle errors appropriately
    console.error("Error retrieving data from MongoDB:", error);
    res.status(500).json({ error: "An error occurred while retrieving data from MongoDB" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// const express = require('express');
// const { MongoClient, ObjectId } = require('mongodb');

// const app = express();
// const PORT = 3000;

// // MongoDB setup
// const connectionURL = "mongodb+srv://ajayalagesan:Ajay%405510@cluster0.ujy7xqk.mongodb.net/?retryWrites=true&w=majority";
// const dbName = 'shopify-timer'; // Database name

// let db; // Database connection reference

// // Connect to MongoDB
// MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(client => {
//         console.log('Connected to MongoDB');
//         db = client.db(dbName); // Set the database reference
//     })
//     .catch(err => {
//         console.error('Error connecting to MongoDB:', err);
//         process.exit(1); // Exit the process if connection fails
//     });

// // home page request from server
// app.get('/', async (req, res) => {
//     try {
//         const result = await db.collection('label').find().toArray();
//         res.send(result);
//     } catch (err) {
//         console.error('Error fetching data:', err);
//         res.status(500).send('Server error');
//     }
//     console.log('request from server for home page!');
// });

// // insert data request to data base
// app.get('/insert', async (req, res) => {
//     try {
//         const result = await db.collection('label').insertOne({
//             name: 'item by express',
//             price: 0
//         });
//         res.send(result);
//     } catch (err) {
//         console.error('Error inserting data:', err);
//         res.status(500).send('Server error');
//     }
//     console.log('request for server to insert data!');
// });

// // delete data request to data base
// app.get('/delete', async (req, res) => {
//     try {
//         const result = await db.collection('label').deleteOne({ _id: ObjectId('61de815a7d911a1a64276823') });
//         res.send(result);
//     } catch (err) {
//         console.error('Error deleting data:', err);
//         res.status(500).send('Server error');
//     }
//     console.log('request for server to delete data!');
// });

// app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
// });
