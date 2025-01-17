const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middle were

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tbbgq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const jobCollection = client.db("all_jobs").collection("jobs");
    const jobApplicationCollection = client.db('all_jobs').collection('job_application');

    app.get('/jobs', async (req, res) => {
      const cursor = jobCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobCollection.findOne(query)
      res.send(result)
    })

    // job application apis
    app.get('/job-application', async(req, res)=>{
      const email = req.query.email;
      const query = {applicant_email: email}
      const result = await jobApplicationCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/job-application', async (req, res) => {
      const application = req.body;
      const result = await jobApplicationCollection.insertOne(application)
      res.send(result)
    })



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('hello world')
});

app.listen(port, () => {
  console.log(`port is runing: ${port}`);
})