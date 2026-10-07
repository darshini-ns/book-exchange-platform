import { Link } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">
          <span className="hero-badge">
            📚 Student Book Community
          </span>

          <h1>
            Welcome to{" "}
            <span>BookLoop</span>
          </h1>

          <p>
            Exchange, donate and discover books with students
            around you. Give your old books a new journey.
          </p>

          <div className="hero-buttons">
            <Link to="/books" className="primary-btn">
              📚 Explore Books
            </Link>

            <Link to="/add-book" className="secondary-btn">
              ➕ Add Your Book
            </Link>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="book-stack">
            <div className="book book-one">📕</div>
            <div className="book book-two">📘</div>
            <div className="book book-three">📗</div>
          </div>
        </div>

      </section>

      {/* Welcome */}
      <section className="welcome-section">
        <div>
          <p className="small-title">YOUR BOOKLOOP ACCOUNT</p>

          <h2>
            Hello, {user?.name || "Student"} 👋
          </h2>

          <p>
            Ready to discover your next useful book?
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">

        <h2>Everything You Need</h2>

        <p className="section-description">
          A simple platform to exchange and share books with students.
        </p>

        <div className="feature-grid">

          <Link to="/books" className="feature-card">
            <div className="feature-icon blue">
              📚
            </div>

            <h3>Browse Books</h3>

            <p>
              Discover books available for exchange and donation.
            </p>

            <span>Explore →</span>
          </Link>

          <Link to="/add-book" className="feature-card">
            <div className="feature-icon purple">
              ➕
            </div>

            <h3>Add a Book</h3>

            <p>
              Share your unused books with other students.
            </p>

            <span>Add Book →</span>
          </Link>

          <Link to="/requests" className="feature-card">
            <div className="feature-icon green">
              📋
            </div>

            <h3>Track Requests</h3>

            <p>
              Check your exchange and donation request status.
            </p>

            <span>View Requests →</span>
          </Link>

        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">

        <h2>How BookLoop Works</h2>

        <div className="steps">

          <div className="step">
            <div className="step-number">01</div>
            <h3>Add</h3>
            <p>List a book you want to exchange or donate.</p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <h3>Discover</h3>
            <p>Search and find books from other students.</p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <h3>Request</h3>
            <p>Send an exchange or donation request.</p>
          </div>

          <div className="step">
            <div className="step-number">04</div>
            <h3>Connect</h3>
            <p>Complete the exchange and give books a new life.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <h3>📚 BookLoop</h3>
        <p>
          Smart Book Exchange & Donation Platform
        </p>
        <span>
          Built for students • Share • Exchange • Learn
        </span>
      </footer>

    </div>
  );
}

export default Home;