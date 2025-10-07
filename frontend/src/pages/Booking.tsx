/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-toastify";

interface Seat {
  seatNumber: string;
  isBooked: boolean;
  _id: string;
}

interface Flight {
  _id: string;
  airline: string;
  flightNumber: number;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  price: number;
  seats: Seat[];
}

interface Passenger {
  name: string;
  email: string;
  seatNumber: string;
}

const Booking = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  useEffect(() => {
    if (flightId) fetchFlight();
  }, [flightId]);

  const fetchFlight = async () => {
    try {
      const { data } = await API.get(`/flights/${flightId}`);
      setFlight(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch flight");
    }
  };

  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      // Remove seat and corresponding passenger
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      setPassengers(passengers.filter((p) => p.seatNumber !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      setPassengers([...passengers, { seatNumber: seat, name: "", email: "" }]);
    }
  };

  const updatePassenger = (
    seatNumber: string,
    field: "name" | "email",
    value: string
  ) => {
    setPassengers(
      passengers.map((p) =>
        p.seatNumber === seatNumber ? { ...p, [field]: value } : p
      )
    );
  };

  const handleBooking = async () => {
    // Validate all passenger info
    for (let p of passengers) {
      if (!p.name || !p.email) {
        toast.error("Please fill name and email for all passengers");
        return;
      }
    }

    try {
      await API.post(
        "/bookings",
        { flightId, passengers },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Booking successful!");
      navigate("/my-bookings");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  if (!flight) return <p className="text-center mt-10">Loading flight...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {flight.airline} - {flight.flightNumber}
      </h2>

      {/* Flight Info */}
      <div className="border p-4 rounded shadow mb-6 bg-white">
        <p>
          {flight.origin} → {flight.destination}
        </p>
        <p>Departure: {new Date(flight.departure).toLocaleString()}</p>
        <p>Arrival: {new Date(flight.arrival).toLocaleString()}</p>
        <p>Price per seat: ₹{flight.price}</p>
      </div>

      {/* Seat Selection */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Select Seats</h3>
        <div className="flex flex-wrap gap-2">
          {flight.seats.map((seat) =>
            !seat.isBooked ? (
              <button
                key={seat.seatNumber}
                onClick={() => toggleSeat(seat.seatNumber)}
                className={`px-3 py-1 border rounded ${
                  selectedSeats.includes(seat.seatNumber)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {seat.seatNumber}
              </button>
            ) : (
              <button
                key={seat.seatNumber}
                disabled
                className="px-3 py-1 border rounded bg-gray-300 text-gray-600 cursor-not-allowed"
              >
                {seat.seatNumber}
              </button>
            )
          )}
        </div>
      </div>

      {/* Passenger Info */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Passenger Info</h3>
        {passengers.map((p) => (
          <div
            key={p.seatNumber}
            className="border p-2 mb-2 rounded bg-gray-50"
          >
            <p className="mb-1 font-medium">Seat: {p.seatNumber}</p>
            <input
              type="text"
              placeholder="Name"
              value={p.name}
              onChange={(e) =>
                updatePassenger(p.seatNumber, "name", e.target.value)
              }
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={p.email}
              onChange={(e) =>
                updatePassenger(p.seatNumber, "email", e.target.value)
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleBooking}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
      >
        Book Flight
      </button>
    </div>
  );
};

export default Booking;
