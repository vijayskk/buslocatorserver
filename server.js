const express = require('express')
var isDBon = false;
const PORT = process.env.PORT || 3000
const { client } = require('./mongo');
const {v4:uuidv4} = require('uuid')
var mydb = client.db("buslocator")
const app = express();
app.use(express.json())

app.use(express.urlencoded({ extended: false }));
app.post('/', (req, res) => {
    res.send("Welcome back...");
})

app.get('/isdb',(req,res)=>{
    if (isDBon) {
        res.status(200).send("DB Connected");
    }else{
        res.status(404).send("DB not Connected");
    }
});

app.post('/api/updatelocation', async (req, res) => {
    console.log(`Request accepted : ${req.body.lat}`)

    try {
        await mydb.collection("buslocations").updateOne({ _id: req.body._id }, {
            $set: {
                lat: req.body.lat,
                lon: req.body.lon,
                time: Date.now()
            }
        }, { upsert: true })
        console.log("1 location updated");
        res.send("Success");
    } catch (err) {
        throw err
        res.status(404).send("Failed");
    }
});

app.get

app.post('/api/addbus',async (req,res)=>{
    try {
        await mydb.collection("busnames").insertOne({
            _id:req.body._id?req.body._id:uuidv4(),
            busname:req.body.busname
        })
        console.log("1 bus updated");
        res.send("Success");
    } catch (err) {
        throw err
        res.status(404).send("Failed");
    }
})


async function connectDB() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("DB Connected");
        isDBon = true
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
connectDB().catch(console.dir);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

