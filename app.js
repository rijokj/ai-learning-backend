const express =require("express")
const mongoose = require("mongoose")

const userRoute = require("./routes/userRoutes")
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const mongo_URI = process.env.MONGO_URI
const PORT = process.env.PORT

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/', userRoute)




app.get('/',(req,res)=>{
    res.send("its working")
})




mongoose.connect(mongo_URI).then(() => {
  console.log('mongodb is connected')
})

app.listen(PORT,()=>{
    console.log("server is running at 3007");
    
})