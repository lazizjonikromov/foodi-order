const express = require('express');
const mongoose = require('mongoose');
const Payment = require('../models/Payments');
const verifyToken = require('../middleware/verifyToken');
const Carts = require('../models/Carts');
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// post payment inform to db
router.post('/', async (req, res) => {
  const payment = req.body;
  try {
    if (!payment || !payment.cartItems || !Array.isArray(payment.cartItems)) {
      return res.status(400).json({ message: 'Invalid payment information' });
    }
    const paymentRequest = await Payment.create(payment);

    // delete cart after payment
    const cartIds = payment.cartItems.map(id => new ObjectId(id));
    await Carts.deleteMany({ _id: { $in: cartIds } });

    res.status(200).json(paymentRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  try {
    const decodedEmail = req.decoded.email;
    if(email !== decodedEmail) {
      res.status(403).send({ message: "Forbidden Access" });
    }

    const result = await Payment.find(query).sort({ createdAt: -1 }).exec();
    res.status(200).json(result);

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;