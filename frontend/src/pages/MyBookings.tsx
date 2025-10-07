/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

interface Passenger {
  name: string;
  email: string;
  seatNumber: string;
}

interface Booking {
  _id: string;
  flight: {
    airline: string;
    flightNumber: number;
    origin: string;
    destination: string;
    departure: string;
    arrival: string;
    price: number;
  };
  passengers: Passenger[];
  totalPrice: number;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Handle if backend returns { bookings: [...] } or just [...]
      const bookingsData = Array.isArray(data) ? data : data.bookings || [];
      setBookings(bookingsData);
      setLoading(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch bookings");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await API.delete(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Booking canceled successfully!");
      setBookings(bookings.filter((b) => b._id !== bookingId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;
  if (!bookings || bookings.length === 0)
    return <p className="text-center mt-10">No bookings found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">My Bookings</h2>

      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="border p-4 rounded shadow mb-4 bg-white"
        >
          <h3 className="font-semibold text-lg mb-2">
            {booking.flight.airline} - {booking.flight.flightNumber}
          </h3>
          <p>
            {booking.flight.origin} → {booking.flight.destination}
          </p>
          <p>
            Departure: {new Date(booking.flight.departure).toLocaleString()}
          </p>
          <p>Arrival: {new Date(booking.flight.arrival).toLocaleString()}</p>
          <p>Total Price: ₹{booking.totalPrice}</p>

          <div className="mt-2">
            <h4 className="font-medium mb-1">Passengers:</h4>
            {booking.passengers.map((p) => (
              <p key={p.seatNumber}>
                {p.name} ({p.email}) - Seat: {p.seatNumber}
              </p>
            ))}
          </div>

          <button
            onClick={() => handleCancelBooking(booking._id)}
            className="mt-3 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
