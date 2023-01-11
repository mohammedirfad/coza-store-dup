const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema ({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    address: [{
        
        fullname:{
            type : String,
            required : true
        },
        phone: {
            type: Number,
            required : true
        },
        pincode:{
            type: Number,
            required : true
        },
     
        street:{
            type : String,
            required : true
        },
        city:{
            type : String,
            required : true
        },
        state:{
            type : String,
            required : true
        },
        
    }]
})

const address = mongoose.model("UserAddress",addressSchema)
module.exports = address
