
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7jyxnen.mongodb.net/?retryWrites=true&w=majority`;



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
    const productCollection = client.db("BuyPhoneDB").collection('products')
    const addToCartCollection  = client.db("BuyPhoneDB").collection('addCart')


    const result = await brandCollection.insertMany(brands)
    console.log(`Inserted ${result.insertedCount} documents`)

    // create data(post)
    app.post('/addProduct',async(req,res)=>{
      const newProduct= req.body
      console.log(newProduct)
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })
    // get product by brand name
    app.get("/product/:brandName", async (req, res) =>{
      const brandName = req.params.brandName;
      const products = await productCollection.find({
        brandName}).toArray();
        res.send(products)

    })

// get product by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    });
     // update
    app.put('/products/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updateProduct =req.body;
      const product = {
        $set:{
          image: updateProduct.image,
          name: updateProduct.name,
          brandName: updateProduct.brandName,
          price: updateProduct.price,
          type: updateProduct.type,
          rating: updateProduct.rating,
      }
    }
    const result = await productCollection.updateOne(filter,product,options)
    res.send(result)
    })

// add to cart
app.post('/addCart',async(req,res)=>{
  const addToCart= req.body
  console.log(addToCart)
  const result = await addToCartCollection.insertOne(addToCart)
  res.send(result)
})



    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

// brand name and img
app.get('/brands',(req,res)=>{
  res.send(brands)
})

app.get('/', (req, res) => {
  res.send('Welcome to the phone-shop server!')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})