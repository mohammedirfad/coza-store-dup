const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    items:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product'
        },
        quantity:{
            type:Number,
            default:1
        },
        Totalprice:{
            type:Number,
            default:0
        },
        date:{
            type: Date,
            default:Date.now
        }
    }],
    cartTotal:{
        type:Number,
        default: 0
    }

})

const cart = mongoose.model('Cart',cartSchema)

module.exports = cart
