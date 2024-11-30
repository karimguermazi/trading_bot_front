import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import './App.css';
import Dashboard from "./components/dashboard/Dashboard";
import CryptoTradingChart from "./components/pages/CryptoTradingChart";
import Home from "./components/pages/home";

const App = () => {
    const isAuthenticated = localStorage.getItem("jwt");

    return (
        <Router>
            <Routes>
                {/* SignIn Route */}
                <Route path="/signin" element={<SignIn />} />

                {/* SignUp Route */}
                <Route path="/signup" element={<SignUp />} />

                {/* Dashboard Route, protect with authentication */}
                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />}
                />

                <Route path="/trading" element={<CryptoTradingChart  />} />

                {/* Home Route */}
                <Route path="/" element={<Home  />} />
            </Routes>
        </Router>
    );
};

export default App;
