const Flight = require("../models/Flight");

exports.searchFlights = async (req, res) => {
  try {
    const { origin, destination, date, airline, minPrice, maxPrice } = req.query;
    const query = {};

    if (origin) query.origin = origin.toUpperCase();
    if (destination) query.destination = destination.toUpperCase();
    if (airline) query.airline = { $regex: airline, $options: "i" };

    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.departure = { $gte: startOfDay, $lte: endOfDay };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const flights = await Flight.find(query).sort({ departure: 1 });

    if (flights.length === 0) {
      return res.status(404).json({ message: "No flights found" });
    }

    res.status(200).json({ flights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().sort({ departure: 1 });
    res.status(200).json({ flights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



