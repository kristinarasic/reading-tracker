import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:4000/users";

export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        age: "",
        gender: ""
    });
    const [message, setMessage] = useState("");
    const [registered, setRegistered] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(API_URL);
            const users = await res.json();

            const userExists = users.some(
                (u) => u.username === form.username || u.email === form.email
            );
            if (userExists) {
                setMessage("Username or email already exists!");
                return;
            }

            const newUser = { ...form, role: "user" };

            const createRes = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (!createRes.ok) throw new Error("Failed to register");

            setRegistered(true);
        } catch (err) {
            console.error(err);
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-50">
            {registered ? (
                <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg border border-green-300 max-w-sm w-full text-center">
                    <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">Account Created!</h2>
                    <p className="text-gray-700 mb-6">Your account has been successfully created. You can now log in and start tracking your reading!</p>
                    <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition-colors">
                        Go to Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                    <h2 className="text-3xl font-bold text-center mb-4 text-black">
                        Welcome to Reading Tracker
                    </h2>

                    <input
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded text-white"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded text-white"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded text-white"
                        required
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={form.age}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded text-white"
                        required
                    />
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded text-white"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                    </select>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Register
                    </button>

                    {message && (
                        <p className="mt-2 text-center text-red-600">{message}</p>
                    )}

                    <p className="mt-4 text-center text-black text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold hover:underline">
                            Log in
                        </Link>
                    </p>
                </form>
            )}
        </div>
    );
}
