import { useNavigate } from "react-router-dom";

interface FlightCardProps {
  flight: {
    _id: string;
    airline: string;
    flightNumber: number;
    origin: string;
    destination: string;
    departure: string;
    arrival: string;
    price: number;
    availableSeats: number;
  };
}

const FlightCard = ({ flight }: FlightCardProps) => {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/booking/${flight._id}`);
  };

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h2 className="font-bold text-lg mb-1">
        {flight.airline} - {flight.flightNumber}
      </h2>
      <p className="text-sm mb-1">
        {flight.origin} → {flight.destination}
      </p>
      <p className="text-sm mb-1">
        Departure: {new Date(flight.departure).toLocaleString()}
      </p>
      <p className="text-sm mb-1">
        Arrival: {new Date(flight.arrival).toLocaleString()}
      </p>
      <p className="text-sm mb-1">Price: ₹{flight.price}</p>
      <p className="text-sm mb-2">Seats Available: {flight.availableSeats}</p>
      <button
        onClick={handleBook}
        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
        disabled={flight.availableSeats === 0}
      >
        {flight.availableSeats === 0 ? "Full" : "Book"}
      </button>
    </div>
  );
};

export default FlightCard;
