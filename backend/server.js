const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const { errorHandler } = require("./utils/errorHandler");

connectDB();
const app = express();
app.use(cors({origin: "http://localhost:5173",
  credentials: true,               
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Flight Booking API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
