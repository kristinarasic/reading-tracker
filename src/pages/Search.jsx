import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";

export default function Search({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4001/books")
            .then((res) => res.json())
            .then((data) => setBooks(data))
            .catch((err) => console.error("Error fetching books:", err));
    }, []);

    useEffect(() => {
        if (!query) {
            setFilteredBooks(books);
            return;
        }

        const fuse = new Fuse(books, {
            keys: ["title", "author"],
            threshold: 0.4,
        });

        const results = fuse.search(query).map((result) => result.item);
        setFilteredBooks(results);
    }, [query, books]);

    const handleSearchChange = (e) => setQuery(e.target.value);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="p-0 min-h-screen bg-100 flex flex-col items-center">
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} />

            <div className="pt-20 flex flex-col items-center w-full">
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex flex-col items-center w-full max-w-md mt-20"
                >
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        placeholder="Type the name of the book or author..."
                        className="w-full p-4 border rounded-lg shadow-md text-white-700 focus:outline-yellow-500"
                    />
                    <button
                        type="submit"
                        className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600"
                    >
                        Search
                    </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl mt-10">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <Link
                                key={book.id}
                                to={`/book/${book.id}`}
                                className="bg-white border-2 border-gray-400 rounded-lg shadow p-4 w-52 h-64 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                            >
                                <div>
                                    <h3 className="text-md font-bold text-gray-800">{book.title}</h3>
                                    <p className="text-gray-600">by {book.author}</p>
                                    <p className="text-sm text-gray-500 italic">{book.genre}</p>
                                    <p className="text-sm text-yellow-700 mt-1">⭐ {book.rating}/5</p>
                                </div>
                                <div className="text-center text-yellow-700 font-semibold mt-2">
                                    📖 Keep Reading!
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="mt-6 text-gray-600 text-center col-span-full">
                            No books found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
