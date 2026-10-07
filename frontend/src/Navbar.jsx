import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-logo">
        <span className="logo-icon">📚</span>
        <span>BookLoop</span>
      </Link>

      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/add-book">Add Book</Link>
        <Link to="/requests">My Requests</Link>
      </div>

      <div className="navbar-user">
        <span className="user-greeting">
          Hi, {user?.name || "Student"} 👋
        </span>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;