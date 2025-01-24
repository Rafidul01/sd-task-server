const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
// const corsOptions = {
//   origin: [
//     "https://sirajganj-dairy-task.web.app",
//     "https://sirajganj-dairy-task.firebaseapp.com/",
//   ],
  
// };
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hjxwn6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const navCollection = await client.db("sirajgonjDairy").collection("navLinks");
    const sellCollection = await client.db("sirajgonjDairy").collection("sells");
    const dairyCollection = await client
      .db("sirajgonjDairy")
      .collection("dairyCollections");

    app.get("/navLinks", async (req, res) => {
      const result = await navCollection.find().toArray();
      res.send(result);
    });

    app.get("/:dbclollection/:category", async (req, res) => {
      const type = req.params.dbclollection;
      const category = req.params.category;
      const query = { category: category };
      if (type === "collection") {
        const result = await dairyCollection.find(query).toArray();
        res.send(result);
      } else if (type === "sells") {
        const result = await sellCollection.find(query).toArray();
        res.send(result);
      } else if (type === "report") {
        const result = await sellCollection.find().toArray();
        res.send(result);
      }
      else {
        const result = await dairyCollection.find().toArray();
        res.send(result);
      }
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    await client.connect();
    await client.db("admin").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
