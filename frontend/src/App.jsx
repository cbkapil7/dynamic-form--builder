import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "../src/component/Header";
import FormBuilder from "./pages/FormBuilder";
import FormsList from "./pages/formList";
import FormViewer from "./pages/FormViewer"; 

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProtectedRoute from "../src/component/protectedRoute";
import { useAuth } from "./context/AuthContext";

const client = new QueryClient();

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      
      <Header />

      <div className="py-10 space-y-12 max-w-3xl mx-auto">
        
        {/* ADMIN ONLY */}
        {user?.role === "ADMIN" && <FormBuilder />}

        {/* ALL USERS */}
        <FormsList />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

         
          <Route
            path="/forms/:id"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
                  
                  <Header />

                  <div className="py-10 max-w-3xl mx-auto">
                    <FormViewer />
                  </div>

                </div>
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}