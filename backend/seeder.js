const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Flight = require("./models/Flight");
const fs = require("fs");

dotenv.config();
const connectDB = require("./config/db");

connectDB();

const flights = JSON.parse(fs.readFileSync("./flightData.json", "utf-8"));

const generateSeats = (totalSeats) => {
  const seats = [];
  const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const seatsPerRow = 6;

  for (let i = 0; i < totalSeats; i++) {
    const row = rows[Math.floor(i / seatsPerRow)];
    const number = (i % seatsPerRow) + 1;
    seats.push({ seatNumber: `${row}${number}`, isBooked: false });
  }

  return seats;
};

const importData = async () => {
  try {
    await Flight.deleteMany(); // clear existing
    const flightsWithSeats = flights.map((f) => ({
      ...f,
      seats: generateSeats(f.availableSeats),
    }));

    await Flight.insertMany(flightsWithSeats);
    console.log("Flights imported with seats!");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importData();
