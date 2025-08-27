import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:4000/users?username=${username}`);
            const users = await res.json();

            const user = users.find((u) => u.password === password);

            if (user) {
                onLogin(user);
                localStorage.setItem("user", JSON.stringify(user));

                if (user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/home"); 
                }
            } else {
                alert("Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-100">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 p-6 bg-white rounded shadow">
                <h1 className="text-2xl font-bold text-center mb-4 text-black">
                    Welcome to Reading Tracker
                </h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border px-2 py-1 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border px-2 py-1 rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>

                <p className="text-center text-sm mt-2 text-black">
                    Don't have an account?{" "}
                    <a href="/signup" className="font-semibold hover:underline">
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    );
}
