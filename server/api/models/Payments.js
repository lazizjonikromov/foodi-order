const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transitionId: String,
  email: String,
  price: Number,
  quantity: Number,
  status: String,
  itemName: Array,
  cartItems: Array,
  menuItems: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// create model
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;