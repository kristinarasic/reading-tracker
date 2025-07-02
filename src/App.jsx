import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

import Login from "./pages/Login.jsx";
import SignUp from "./pages/Signup.jsx";
import Home from "./pages/Homeee.jsx";
import Account from "./pages/Account.jsx";

export default function App() {
  const [user, setUser] = useState(null);


  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => setUser(null);

  function ProtectedRoute({ children }) {
    if (!user) {
      // if not logged in, redirect to login
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">

    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={<SignUp />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account user={user} />
            </ProtectedRoute>
          }
        />
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router></div>
  );
}
