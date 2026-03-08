import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MailIcon, MessageCircleIcon } from "lucide-react";

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
    <div className="w-full flex items-center justify-center p-4 bg-slate-900 min-h-screen">
      <div className="relative w-full max-w-md">
        <BorderAnimatedContainer>
          <div className="w-full p-6 md:p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-200 mb-2">Forgot Password</h2>
                <p className="text-slate-400">Enter your email to get a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="auth-input-label">Email</label>
                  <div className="relative">
                    <MailIcon className="auth-input-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button className="auth-btn w-full">
                  Send Reset Link
                </button>
              </form>

              {message && (
                <p className="mt-4 text-sm text-center text-cyan-400">{message}</p>
              )}

              <div className="mt-6 text-center">
                <Link to="/login" className="auth-link">
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;