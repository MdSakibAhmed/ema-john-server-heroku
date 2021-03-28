const express = require("express")
const cors = require("cors");
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dr8av.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(cors())
app.use(express.json())




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db(process.env.DB_NAME).collection("products");
  const orderCollection = client.db(process.env.DB_NAME).collection("orders");
  
app.post("/addProduct", (req,res) => {
    const products = req.body;
    productCollection.insertMany(products).then(result => {
        res.send(result)
        console.log(result);
    })
})

app.get("/products", (req,res) => {
    productCollection.find({}).toArray((err,documents) => {
        res.send(documents)
    })
})

app.post("/productsByKeys",(req,res) => {
    productCollection.find({key:{$in:req.body}}).toArray((err,documents) => {
        res.send(documents)
    })
})

app.get("/product/:key", (req,res) => {
    productCollection.find({key:req.params.key}).toArray((err,documents) => {
        res.send(documents)
    })
})

app.post("/addOrder",(req, res) => {
    const order = req.body;
    orderCollection.insertOne(order).then(result => {
        res.send(result.insertedCount> 0)
    })
})

})




app.listen(process.env.PORT || 5000,()=> {
    console.log(" i am listening from 5000 port");
})