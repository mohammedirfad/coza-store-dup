const mongoose = require("mongoose");
// const { array } = require("../middlewares/multer");

const oderSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      default: 1
    },
    totalPrice: {
      type: Number,
      default: 0

    },

  }],
  total: {
    type: Number,
    required: true,
  },
  address: {

    fullname: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    pincode: {
      type: Number,
      required: true
    },

    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['CONFIRMED', 'SHIPPED', 'OUT FOR DELIVERY', 'DELIVERED', 'CANCELLED'],
  },
  orderdate: {
    type: Date,
    default: Date.now
  },
  Returnreason:{
    type:String
  },
  useWallet:{
    type:Number,
  },


  couponDiscount: {
    type: Number,
  },

}, {
  timestamps: true
});

const Order = mongoose.model("Order", oderSchema);

module.exports = Order;