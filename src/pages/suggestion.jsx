import { useState } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";

export default function Suggestion({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        year: "",
        genre: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token"); 
        if (!token) {
            alert("You must be logged in to suggest a book!");
            return;
        }

        const payload = {
            ...formData,
            year: Number(formData.year) 
        };

        try {
            const res = await fetch("http://localhost:5000/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 201) {
                alert("Book suggestion submitted ✅");
                setFormData({ title: "", author: "", year: "", genre: "" });
            } else if (res.status === 401) {
                alert("You are not authorized. Please log in again.");
            } else {
                const data = await res.json();
                alert(`Failed: ${data.message || 'Check the input.'}`);
            }
        } catch (error) {
            console.error("Error submitting suggestion:", error);
            alert("Something went wrong ❌");
        }
    };

    return (
        <div className="p-0">
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />

            <div className="pt-20 px-6 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">
                    Suggest a Book
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-100 p-6 rounded-2xl shadow-lg space-y-4"
                >
                    <input
                        type="text"
                        name="title"
                        placeholder="Book Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={formData.author}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />

                    <input
                        type="number"
                        name="year"
                        placeholder="Year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="genre"
                        placeholder="Genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600"
                    >
                        Suggest a Book
                    </button>
                </form>
            </div>
        </div>
    );
}
