import { useState, useEffect } from "react";

export default function AdminBooks() {
    const [books, setBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState("");
    const [bookData, setBookData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:4001/books")
            .then((res) => res.json())
            .then((data) => setBooks(data));
    }, []);

    const handleSelect = (e) => {
        const bookId = e.target.value;
        setSelectedBookId(bookId);
        const book = books.find((b) => b.id === bookId);
        setBookData(book || null);
    };

    const handleChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!bookData) return;

        fetch(`http://localhost:4001/books/${bookData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookData),
        })
            .then((res) => res.json())
            .then((updatedBook) => {
                setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
                alert(`Book "${updatedBook.title}" updated successfully!`);
            });
    };

    return (
        <div className="p-8">
            <button
                onClick={() => window.history.back()}
                className="mb-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-black"
            >
                ← Back
            </button>

            <h2 className="text-2xl font-bold mb-4">Manage Books</h2>

            <select
                value={selectedBookId}
                onChange={handleSelect}
                className="border p-2 mb-4 rounded w-80"
            >
                <option value="">Select a book</option>
                {books.map((book) => (
                    <option key={book.id} value={book.id}>
                        {book.title}
                    </option>
                ))}
            </select>

            {bookData && (
                <fieldset className="border p-4 rounded w-96">
                    <legend className="font-bold mb-2">Edit Book</legend>
                    <div className="flex flex-col gap-2">
                        <label>
                            Title:
                            <input
                                type="text"
                                name="title"
                                value={bookData.title}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </label>

                        <label>
                            Author:
                            <input
                                type="text"
                                name="author"
                                value={bookData.author}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </label>

                        <label>
                            Genre:
                            <input
                                type="text"
                                name="genre"
                                value={bookData.genre}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </label>

                        <label>
                            Year:
                            <input
                                type="number"
                                name="year"
                                value={bookData.year}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </label>

                        <label>
                            Rating:
                            <input
                                type="number"
                                name="rating"
                                value={bookData.rating}
                                min="1"
                                max="5"
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </label>

                        <label>
                            Pages:
                            <input
                                type="number"
                                name="pages"
                                value={bookData.pages}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </label>

                        <label>
                            Description:
                            <textarea
                                name="description"
                                value={bookData.description}
                                onChange={handleChange}
                                className="border px-2 py-1 rounded w-full"
                                rows="4"
                            />
                        </label>

                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                        >
                            Save
                        </button>
                    </div>
                </fieldset>
            )}
        </div>
    );
}
