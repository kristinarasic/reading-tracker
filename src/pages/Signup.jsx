import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:4000/users";

export default function Signup() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
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
                setMessage("User already exists!");
                return;
            }

            const createRes = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!createRes.ok) throw new Error("Failed to register");

            // 🟢 Set "registered" to true to hide form and show success message
            setRegistered(true);
        } catch (err) {
            console.error(err);
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="max-w-sm mx-auto p-8 bg-green-50 rounded-lg shadow-md mt-20">
            {registered ? (
                <div className="text-center">
                    <h2 className="text-2xl mb-4 font-bold text-green-800">
                        Successfully created an account!
                    </h2>
                    <p>
                        Do you want to{" "}
                        <Link to="/login" className="text-green-700 underline">
                            log in
                        </Link>
                        ?
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h2 className="text-4xl mb-8 text-center font-extrabold text-green-800">
                        Sign Up
                    </h2>

                    <input
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="border border-green-300 rounded-md p-3 mb-4 w-full placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
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
                        className="border border-green-300 rounded-md p-3 mb-6 w-full placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 rounded-md w-full shadow"
                    >
                        Register
                    </button>

                    {message && (
                        <p className="mt-4 text-center text-red-600 font-semibold">
                            {message}
                        </p>
                    )}

                    <p className="mt-6 text-center text-green-700 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="underline hover:text-green-900">
                            Log in
                        </Link>
                    </p>
                </form>
            )}
        </div>
    );
}
