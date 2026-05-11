import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../services/api";
import { getErrorMessage } from "../utils/getErrorMessage";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await API.post(
        "/auth/signup",
        formData
      );

      toast.success("Account created successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Signup failed"
      );

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl md:grid-cols-[0.9fr_1fr]">
        <div className="hidden bg-gray-950 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">
              Team Task Manager
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight">
              Bring your team into one focused work hub.
            </h1>
          </div>

          <div className="grid gap-3 text-sm text-gray-300">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              Create projects with role-based members
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              Track deadlines, priorities, and completion
            </div>
          </div>
        </div>

        <div className="w-full p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Get Started
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Set up access and start organizing team work in minutes.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-950 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Signup"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?

            <Link
              to="/login"
              className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
