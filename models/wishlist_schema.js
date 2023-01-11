const mongoose = require('mongoose')


const wishlistSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    items:[{

       product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
       }
    }]
})

const wishlist = mongoose.model('Wishlist',wishlistSchema )
module.exports = wishlist