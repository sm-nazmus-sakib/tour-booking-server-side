const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const objectId = require("mongodb").ObjectId;
const corse = require("cors");


// User Id & Password

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gopj00k.mongodb.net/?retryWrites=true&w=majority`;


// middleware
app.use(corse());
app.use(express.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function run() {
  try {
    // Craete Database and Collection
    // as package is a reserve word so that use service as a package
    await client.connect();
    const database = client.db("tour-booking");
    const servicesCollection = database.collection("services");

    app.get("/", (req, res) => {
      res.send("Running tour-booking");
    });


     // Send Data in Database
     app.post("/services", async (req, res) => {
      const service = req.body;
        console.log("Send the Data in Database", service);
      const result = await servicesCollection.insertOne(service);
      res.send(result);
    });


    // Get All Collection
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });


    //   Get 1 Tour Package Details
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("get 1 Tour id", id);
      const query = { _id: objectId(id) };
      const service = await servicesCollection.findOne(query);

      res.json(service);
    });

    app.listen(port, () => {
      console.log("Running tour-booking server on port", port);
    });

   
    //Delete any Package
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);
