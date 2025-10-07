const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

exports.bookFlight = async (req, res) => {
  const { flightId, passengers } = req.body;

  if (!flightId || !passengers || passengers.length === 0) {
    return res.status(400).json({ message: "Flight and passenger info required" });
  }

  try {
    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (flight.availableSeats < passengers.length) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Check if selected seats are available
    for (let p of passengers) {
      const seat = flight.seats.find(
        (s) => s.seatNumber === p.seatNumber
      );
      if (!seat) {
        return res.status(400).json({ message: `Seat ${p.seatNumber} does not exist` });
      }
      if (seat.isBooked) {
        return res.status(400).json({ message: `Seat ${p.seatNumber} is already booked` });
      }
    }

    // Mark seats as booked
    passengers.forEach((p) => {
      const seat = flight.seats.find((s) => s.seatNumber === p.seatNumber);
      seat.isBooked = true;
    });

    flight.availableSeats -= passengers.length;
    await flight.save();

    const totalPrice = flight.price * passengers.length;

    const booking = await Booking.create({
      user: req.user._id,
      flight: flight._id,
      passengers,
      totalPrice,
    });

    res.status(201).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("flight") // includes flight details
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("flight");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to cancel this booking" });
    }

    // Free the booked seats
    booking.passengers.forEach((p) => {
      const seat = booking.flight.seats.find((s) => s.seatNumber === p.seatNumber);
      if (seat) seat.isBooked = false;
    });

    booking.flight.availableSeats += booking.passengers.length;
    await booking.flight.save();

    await booking.deleteOne();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


