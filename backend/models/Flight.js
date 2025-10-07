const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  airlineCode: { type: String, required: true },
  flightNumber: { type: Number, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  availableSeats: { type: Number, required: true },
  seats: [
    {
      seatNumber: String,
      isBooked: { type: Boolean, default: false },
    },
  ],
  price: { type: Number, required: true },
  departure: { type: Date, required: true },
  arrival: { type: Date, required: true },
  duration: { type: String },
  operationalDays: [{ type: Number }],
});

module.exports = mongoose.model("Flight", flightSchema);
