import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Library({ user, onUpdate }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [booksData, setBooksData] = useState([]);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [filter, setFilter] = useState("currentlyReading");
    const [hoveredBook, setHoveredBook] = useState(null);

    useEffect(() => {
        fetch("http://localhost:4001/books")
            .then((res) => res.json())
            .then((data) => setBooksData(data))
            .catch((err) => console.error("Error fetching books:", err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:4000/users")
            .then((res) => res.json())
            .then((data) => {
                const current = data.find((u) => u.id === user.id);
                setCurrentUserData(current);
            })
            .catch((err) => console.error("Error fetching users:", err));
    }, [user]);

    if (!currentUserData) return <div className="pt-16 px-4">Loading user data...</div>;

    const getBookById = (id) => booksData.find((b) => b.id.toString() === id);
    const filteredBooks = currentUserData[filter]
        .map((item) => getBookById(item.bookId))
        .filter(Boolean);

    const handleRemove = async (bookId) => {
        const updatedUser = { ...currentUserData };
        ["currentlyReading", "wantToRead", "finished"].forEach((list) => {
            updatedUser[list] = updatedUser[list].filter((b) => b.bookId !== bookId);
        });

        setCurrentUserData(updatedUser);
        onUpdate(updatedUser);

        try {
            await fetch(`http://localhost:4000/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleChangeStatus = async (bookId, newStatus) => {
        const now = new Date().toISOString();
        const updatedUser = { ...currentUserData };

        ["currentlyReading", "wantToRead", "finished"].forEach((list) => {
            updatedUser[list] = updatedUser[list].filter((b) => b.bookId !== bookId);
        });

        if (newStatus === "currentlyReading") updatedUser.currentlyReading.push({ bookId, startedAt: now });
        if (newStatus === "wantToRead") updatedUser.wantToRead.push({ bookId, addedAt: now });
        if (newStatus === "finished") updatedUser.finished.push({ bookId, finishedAt: now });

        setCurrentUserData(updatedUser);
        onUpdate(updatedUser);

        try {
            await fetch(`http://localhost:4000/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className="p-0">
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />

            <div className="mt-0 px-4 flex flex-col items-center w-full max-w-5xl">
                <h1 className="text-2xl text-black font-bold mb-6">{currentUserData.username}'s Library</h1>

                <div className="flex gap-4 mb-6">
                    {["currentlyReading", "wantToRead", "finished"].map((f) => (
                        <button
                            key={f}
                            className={`px-4 py-2 rounded ${filter === f ? (f === "currentlyReading" ? "bg-green-500 text-black" : f === "wantToRead" ? "bg-blue-500 text-black" : "bg-yellow-500 text-black") : "text-black-200"}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === "currentlyReading" ? "Currently Reading" : f === "wantToRead" ? "Want to Read" : "Finished"}
                        </button>
                    ))}
                </div>

                {filteredBooks.length === 0 ? (
                    <p className="text-gray-700">No books in this category.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                onMouseEnter={() => setHoveredBook(book.id)}
                                onMouseLeave={() => setHoveredBook(null)}
                                className="relative flex flex-col items-stretch"
                            >
                                <Link
                                    to={`/book/${book.id}`}
                                    className="bg-white border-2 border-gray-400 rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                                >
                                    <h3 className="text-lg font-bold">{book.title}</h3>
                                    <p className="text-gray-600">by {book.author}</p>
                                    <p className="text-sm text-gray-500 italic">{book.genre}</p>
                                </Link>

                                {hoveredBook === book.id && (
                                    <div className="flex gap-2 mt-2 w-full justify-between bg-white p-2 border border-gray-300 rounded">
                                        <select
                                            defaultValue=""
                                            onChange={(e) => handleChangeStatus(book.id, e.target.value)}
                                            className="border border-gray-400 rounded p-1"
                                        >
                                            <option value="" disabled>Change status</option>
                                            <option value="currentlyReading">Currently Reading</option>
                                            <option value="wantToRead">Want to Read</option>
                                            <option value="finished">Finished</option>
                                        </select>
                                        <button
                                            className="bg-red-500 text-white px-2 rounded"
                                            onClick={() => handleRemove(book.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
