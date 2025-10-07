const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  passengers: [
    {
      name: String,
      age: Number,
      seatNumber: String,
    },
  ],
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
