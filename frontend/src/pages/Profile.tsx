/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface User {
  _id: string;
  name: string;
  email: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch profile");
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const bookingsData = Array.isArray(data) ? data : data.bookings || [];
      setBookings(bookingsData);
      setLoading(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch bookings");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
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
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: User Info */}
      <div className="border p-6 rounded shadow bg-white">
        <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
        {user ? (
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
        ) : (
          <p>User not found.</p>
        )}
      </div>

      {/* Right Column: User Bookings */}
      <div className="border p-6 rounded shadow bg-white flex flex-col">
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <>
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking._id} className="border p-4 rounded shadow mb-4">
                <h3 className="font-semibold text-lg mb-2">
                  {booking.flight.airline} - {booking.flight.flightNumber}
                </h3>
                <p>
                  {booking.flight.origin} → {booking.flight.destination}
                </p>
                <p>
                  Departure:{" "}
                  {new Date(booking.flight.departure).toLocaleString()}
                </p>
                <p>
                  Arrival: {new Date(booking.flight.arrival).toLocaleString()}
                </p>
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
                  className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel Booking
                </button>
              </div>
            ))}

            {bookings.length > 3 && (
              <button
                onClick={() => navigate("/my-bookings")}
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Show All
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
