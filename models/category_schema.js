const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const categoryschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        required:true

    }


},
{timestamps:true}
)

const category = mongoose.model("Category" , categoryschema)
module.exports = category