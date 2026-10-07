import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddBook() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    category: "Other",
    type: "Exchange",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Please login first.");
      setSuccess(false);
      return;
    }

    setMessage("Adding your book...");
    setSuccess(false);

    try {
      const response = await API.post("/books", {
        ...form,
        owner: user.id,
      });

      setMessage(response.data.message);
      setSuccess(true);

      setForm({
        title: "",
        author: "",
        description: "",
        category: "Other",
        type: "Exchange",
      });
    } catch (error) {
      console.error("Add book error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to add book"
      );

      setSuccess(false);
    }
  };

  return (
    <div className="add-book-page">

      <div className="add-book-container">

        {/* Header */}
        <div className="add-book-header">
          <div className="add-book-icon">📚</div>

          <span className="add-book-badge">
            BOOKLOOP COMMUNITY
          </span>

          <h1>Share a Book</h1>

          <p>
            Give your unused books a new journey by
            sharing them with other students.
          </p>
        </div>

        {/* Form */}
        <div className="add-book-form-card">

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>📖 Book Title</label>

              <input
                type="text"
                name="title"
                placeholder="Enter book title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>✍️ Author</label>

              <input
                type="text"
                name="author"
                placeholder="Enter author name"
                value={form.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>📝 Description</label>

              <textarea
                name="description"
                placeholder="Tell students something about this book..."
                value={form.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>🏷️ Category</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Other">Other</option>
                  <option value="Programming">
                    Programming
                  </option>
                  <option value="Academic">
                    Academic
                  </option>
                  <option value="Novel">
                    Novel
                  </option>
                  <option value="Science">
                    Science
                  </option>
                  <option value="Technology">
                    Technology
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>🔄 Sharing Type</label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="Exchange">
                    🔄 Exchange
                  </option>

                  <option value="Donation">
                    🎁 Donation
                  </option>
                </select>
              </div>

            </div>

            {/* Info */}
            <div className="sharing-info">
              <span>💡</span>

              <div>
                <strong>
                  {form.type === "Donation"
                    ? "Donation selected"
                    : "Exchange selected"}
                </strong>

                <p>
                  {form.type === "Donation"
                    ? "Other students can request this book as a donation."
                    : "Other students can request this book for an exchange."}
                </p>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={
                  success
                    ? "form-message success"
                    : "form-message"
                }
              >
                {success ? "✅ " : "⚠️ "}
                {message}
              </div>
            )}

            <button
              type="submit"
              className="add-book-submit"
            >
              📚 Add Book to BookLoop
            </button>

          </form>

          <button
            onClick={() => navigate("/home")}
            className="back-home-btn"
          >
            ← Back to Home
          </button>

        </div>
      </div>
    </div>
  );
}

export default AddBook;