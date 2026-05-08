import { useState } from "react";
import { useLogin } from "../hooks/useAuth";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useLogin();
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Wait for auth state to initialize, then redirect if already logged in
  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Optional: Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogin = () => {
    mutate(
      { email, password },
      {
        onSuccess: (res) => {
          console.log("LOGIN RESPONSE:", res);

          const user =
            res?.data?.user ||
            res?.user ||
            res?.data;
          console.log(user, "++++user")

          if (!user || typeof user !== "object") {
            console.error("Invalid user object", res);
            alert("Login failed: invalid server response");
            return;
          }


          if (!user.id || !user.role) {
            console.error("Missing user fields", user);
            alert("Login failed: incomplete user data");
            return;
          }

          login(user);

          navigate("/", { replace: true });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Login to your account
        </p>


        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>

          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>


        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Password
          </label>

          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>


        <button
          onClick={handleLogin}
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>


        <p className="text-sm text-center text-gray-500 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-black font-medium cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>

      </div>
    </div>
  );
}