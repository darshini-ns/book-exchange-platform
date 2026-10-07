import { useEffect, useState } from "react";
import API from "../services/api";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await API.get("/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (book) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (user.id === book.owner?._id) {
      alert("You cannot request your own book.");
      return;
    }

    try {
      const response = await API.post("/requests", {
        book: book._id,
        requester: user.id,
        owner: book.owner._id,
        type: book.type,
      });

      alert(response.data.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to submit request"
      );
    }
  };

  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="books-page">
      {/* Header */}
      <section className="books-header">
        <span className="books-badge">📚 BOOKLOOP LIBRARY</span>

        <h1>Discover Your Next Book</h1>

        <p>
          Explore books shared by students for exchange and donation.
        </p>
      </section>

      {/* Search & Filter */}
      <section className="books-filter">
        <div className="search-wrapper">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">📚 All Categories</option>
          <option value="Programming">Programming</option>
          <option value="Academic">Academic</option>
          <option value="Novel">Novel</option>
          <option value="Science">Science</option>
          <option value="Technology">Technology</option>
          <option value="Other">Other</option>
        </select>
      </section>

      {/* Count */}
      {!loading && (
        <div className="books-count">
          <strong>{filteredBooks.length}</strong> books available
        </div>
      )}

      {/* Books */}
      {loading ? (
        <div className="books-message">
          <div className="loading-icon">📚</div>
          <h3>Loading books...</h3>
          <p>Finding books shared by students.</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="books-message">
          <div className="loading-icon">🔎</div>
          <h3>No books found</h3>
          <p>Try another title, author or category.</p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div className="book-card" key={book._id}>

              <div className="book-cover">
                <span>📖</span>
              </div>

              <div className="book-content">
                <div className="book-top">
                  <span className="category-badge">
                    {book.category}
                  </span>

                  <span
                    className={
                      book.type === "Donation"
                        ? "type-badge donation"
                        : "type-badge exchange"
                    }
                  >
                    {book.type === "Donation"
                      ? "🎁 Donation"
                      : "🔄 Exchange"}
                  </span>
                </div>

                <h2>{book.title}</h2>

                <p className="author">
                  ✍️ {book.author}
                </p>

                <p className="description">
                  {book.description ||
                    "No description provided for this book."}
                </p>

                <div className="owner">
                  <div className="owner-avatar">
                    {book.owner?.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div>
                    <small>Shared by</small>
                    <strong>
                      {book.owner?.name || "Unknown"}
                    </strong>
                  </div>
                </div>

                <button
                  className="request-btn"
                  onClick={() => handleRequest(book)}
                >
                  {book.type === "Donation"
                    ? "🎁 Request Donation"
                    : "🔄 Request Exchange"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Books;