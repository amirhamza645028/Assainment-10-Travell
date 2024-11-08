const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// medleware
app.use(cors());
app.use(express.json());

// 
// 722v8eRv2ZC3iOU9



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ayhh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const turistSpotCollection = client.db('Ture_travel').collections('turespots')

        app.get('/tourist-spot', async (req, res) => {
            const result = (await turistSpotCollection).find().toArray();
            res.send(result)
        });
        app.post('/add-tourist-spot', async (req, res) => {
            const newPost = req.body;
            const result = await turistSpotCollection.insertOne(newPost);
            res.send(result)
        });
        app.get('/singleSpot/:id', async (req, res) => {
            const id = new ObjectId(req.params.id);
            const result = await turistSpotCollection.findOne({ _id: id });
            res.send(result)

        });
        app.get('/all-tourist-spot/:email', async (req, res) => {
            const email = req.params.email;
            const result = (await turistSpotCollection).find({ userEmail: email }).toArray();
            res.send(result)
        });
        app.put('updateSpot/:id', async (req, res) => {
            const id = new ObjectId(req.params.id);
            console.log(id)
            const updateData = {
                $set: {
                    imgURLs: req.body.imgURLs,
                    touristSpotName: req.body.touristSpotName,
                    countryName: req.body.countryName,
                    location: req.body.location,
                    shortDescription: req.body.shortDescription,
                    seasonName: req.body.seasonName,
                    avrCost: req.body.avrCost,
                    travelTime: req.body.travelTime,
                    totalVisitors: req.body.totalVisitors
                }
            };
            const result = await touristSpotsCollection.updateOne({ _id: id }, updateData);
            res.send(result);
        })
        app.delete('/deleteItem/:id',async(req,res)=>{
            const id = new ObjectId(req.params.id);
            const result = await turistSpotCollection.deleteOne({_id: id});
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(" Amirhamza Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('treavale is rung')
})

app.listen(port, () => {
    console.log(`Travel server is runing port : ${port}`)
})