import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="btn btn-primary w-full">
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center">{message}</p>
        )}

        <Link to="/login" className="text-sm mt-4 block text-center link">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;