const mongoose =require('mongoose')
//const Schema =mongoose.Schema;

// const bcrypt = require('bcrypt')

const userdetailsschema = new mongoose.Schema({
    fname:{
        type:String,
        required:[true ,"first name requires"]
    },
    email:{
        type:String,
        required:[true ,'the feild is required']
       
    },
    password:{
        type:String,
        required:[true, 'the field is required'],
        minLength:[5,"too short"],
       // max:10
    },
   
    repassword:{
        type:String,
        required:[true, 'the field is required'],
        minLength:[5,"too short"],
       // max:10
    }, 
      mobile:{
        type:Number,
        required:[true ," Number requires"],
    },
    image:{
        type:Array
    },
    Wallet:{
        type:Number,
        default:0
    },


   block:{
    type:Boolean,
    default:true
   },
   resetToken:String,
   resetTokenExpiration : Date

   
  
  
},
{
timestamps:true
})

let user= mongoose.model('User',userdetailsschema);
module.exports=user

