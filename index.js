const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejjfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


        const tourCartCollection = client.db("countryTour_data").collection("countryTour");
        const userCollection = client.db("userTour").collection("user");

        app.get('/bookings', async (req, res) => {
            const cursor = tourCartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tourCartCollection.findOne(query);  
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user', user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const user = await userCollection.findOne(query);
            res.send(user);
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);
        
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);  
            res.send(result);
        });
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: new ObjectId(id) };
            const option = {upsert : true}
            const updatedUser = {
                $set : {
                        photo : user.photo,
                        tourists_spot_name : user.tourists_spot_name,
                        country_Name : user.country_Name,
                        location : user.location,
                        short_description : user.short_description,
                        average_cost : user.average_cost,
                        seasonality : user.seasonality,
                        travel_time : user.travel_time,
                        totalVisitors : user.totalVisitors,
                        name : user.name,
                        email : user.email
                }  
            }
            const result = await userCollection.updateOne(filter, updatedUser, option);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



// Routes
app.get('/', (req, res) => {
    res.send('Welcome our tourism website!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
