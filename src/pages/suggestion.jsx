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

        try {
            await fetch("http://localhost:4003/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            alert("Book suggestion submitted ✅");

            setFormData({
                title: "",
                author: "",
                year: "",
                genre: "",
            });
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
