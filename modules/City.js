const mongoose = require("mongoose")
 const Schema = mongoose.Schema

 const CitySchema = new Schema({
    name:String,
    temp:Number,
    condition:String,
    conditionPic:String
 })
 const City = mongoose.model("city", CitySchema)

 module.exports = City