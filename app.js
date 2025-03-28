const express =require("express")
const mongoose = require("mongoose")
const adminRoute = require("./routes/adminRoute")
const userRoute = require("./routes/userRoutes")
const cors = require('cors')
const bodyParser = require('body-parser')
const auth = require ("./middleware/authMiddlware")
const path = require('path')
require('dotenv').config()
const mongo_URI = process.env.MONGO_URI
const PORT = process.env.PORT

const app = express()
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(bodyParser.json())

app.use('/', userRoute)
app.use('/admin', adminRoute)




app.get('/',(req,res)=>{
    res.send("its working")
})




mongoose.connect(mongo_URI).then(() => {
  console.log('mongodb is connected')
})

app.listen(PORT,()=>{
    console.log("server is running at 3007");
    
})