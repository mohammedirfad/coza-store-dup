const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({

    category: {
        type:String,
        required:true  
    },
    image:{
        type:Array,
        required: true
    },
    title: {
        type:String,
        required:true
    },
    text: {
        type: String,
        required: true
    },
    delete: {
        type:Boolean,
          default: false
    },
    offer:{
        type:Number,
        default: 0
      },
    links:{
    type:String,
    required:true
      }
});

const banner = mongoose.model("Banner",bannerSchema)
module.exports= banner