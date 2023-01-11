const mongoose = require('mongoose')
const CouponSchema = new mongoose.Schema({
    code : {
        type : String,
        required : true
    },
    percentage: {
        type : Boolean
        
    },
    amount :{
        type : Number,
        // default : new Date()
    },

    minCartAmount : {
        type : Number,
        required : true
    },
  
 
    maxRedeemAmount : {
        type : Number,
        required : true
    },
 
    expireDate : {
        type : Date,
        require : true
    },
    available : {
        type : Number,
        required : true
    },

      status : {
        type : String,
        default : 'ACTIVE'
    },

},{
    timestamps:true
})

const coupon  = mongoose.model('Coupon' ,CouponSchema)
module.exports= coupon
