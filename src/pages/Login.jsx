import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "http://localhost:4000/users";

export default function Login({ onLogin }) {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(API_URL);
            if (!res.ok) {
                throw new Error("Failed to fetch users");
            }

            const users = await res.json();
            const user = users.find(
                (u) => u.username === form.username && u.password === form.password
            );

            if (!user) {
                setError("Invalid username or password");
                return;
            }

            onLogin(user);             
            navigate("/home");        
        } catch (err) {
            console.error(err);
            setError("Login failed. Please try again later.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-sm mx-auto p-8 bg-green-50 rounded-lg shadow-md mt-20"
        >
            <h1 className="text-4xl mb-8 text-center font-extrabold text-green-800">
                Reading Tracker
            </h1>

            <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="border border-green-300 rounded-md p-3 mb-4 w-full placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="border border-green-300 rounded-md p-3 mb-4 w-full placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
            />

            {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

            <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 rounded-md w-full shadow"
            >
                Login
            </button>

            <p className="mt-6 text-center text-green-700 text-sm">
                Don’t have an account?{" "}
                <Link to="/signup" className="underline hover:text-green-900">
                    Click here to sign up
                </Link>
            </p>
        </form>
    );
}
