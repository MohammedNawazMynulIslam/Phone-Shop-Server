
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7jyxnen.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// brand name and img
const brands =[
  {
    name:"iphone",
    image:"https://i.ibb.co/dQQ4GSP/AV-IPHONE15-OFF.webp"
  },
  {
    name:"Samsung",
    image:"https://i.ibb.co/nc1Zfv6/Samsung-Logo-2.png"
  },
  {
    name:"Realme",
    image:"https://i.ibb.co/82P3YmS/Realme-logo.png"
  },
  {
    name:"Xiomi",
    image:"https://i.ibb.co/ZgK70R0/Xiaomi-logo-svg.png"
  },
  {
    name:"Google Pixel",
    image:"https://i.ibb.co/cNzM3s5/google-pixel-4-logo-is-seen-at-a-store-in-mountain-view-california-on-november-2-2019-google-pixel-4.jpg"
  },
  {
    name:"Asus Rog",
    image:"https://i.ibb.co/X22bHq4/asus-rog-phone-3-immagini-render-leak-smartphone-gaming-2.jpg"
  },
]
async function run() {
  try {

    await client.connect();
    const brandCollection = client.db("BuyPhoneDB").collection('brands')

    const result = await brandCollection.insertMany(brands)
    console.log(`Inserted ${result.insertedCount} documents`)
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})