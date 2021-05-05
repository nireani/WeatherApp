const express = require("express")
const app = express()
const path = require("path")
const api = require("./server/routes/api")
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost/WeatherApp",{ useFindAndModify: false , useUnifiedTopology: true ,useNewUrlParser: true } )


app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.use('/',api)

const port = 3010
app.listen(port , function(){
    console.log(`running on port ${port}`);
})

