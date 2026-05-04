import { useState } from "react";
import { useRegister } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();


  const { mutate, isPending } = useRegister();
  

  const handleSignup = () => {
    mutate(
      { email, password },
      {
        onSuccess: () => {
          setIsSuccess(true);
         
        }
      }
    );
  };

  
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Signup Successful
          </h2>

          <p className="text-gray-600 mb-6">
            Your account has been created successfully.
          </p>

          <button
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account 
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Signup to get started
        </p>

      
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>

          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

     
        <button
          onClick={handleSignup}
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {isPending ? "Signing up..." : "Signup"}
        </button>

      
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            className="text-black font-medium cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}