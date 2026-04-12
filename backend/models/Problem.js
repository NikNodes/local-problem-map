const mongoose = require("mongoose")

const ProblemSchema = new mongoose.Schema({

name: String,
category: String,
description: String,

lat: Number,
lng: Number,

votes:{
type:Number,
default:0
},

status:{
type:String,
default:"pending"
}

})

module.exports = mongoose.model("Problem", ProblemSchema)