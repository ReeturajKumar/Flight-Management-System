/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import API from "../api/api";
import FlightCard from "../components/FlightCard";
import { toast } from "react-toastify";

interface Flight {
  _id: string;
  airline: string;
  flightNumber: number;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  price: number;
  availableSeats: number;
}

const Flights = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  // Fetch all flights initially
  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async (params = {}) => {
    try {
      const { data } = await API.get("/flights", { params });
      setFlights(data.flights || []); // <-- add .flights
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch flights");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (origin) params.origin = origin;
    if (destination) params.destination = destination;
    if (date) params.date = date;

    fetchFlights(params);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Search Flights</h2>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap gap-4 justify-center mb-6"
      >
        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Flight Results Grid */}
      {flights.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flights.map((flight) => (
            <FlightCard key={flight._id} flight={flight} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No flights found.</p>
      )}
    </div>
  );
};

export default Flights;
