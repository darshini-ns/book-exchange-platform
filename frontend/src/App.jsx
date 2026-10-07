import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddBook from "./pages/AddBook";
import Books from "./pages/Books";
import Requests from "./pages/Requests";
import Navbar from "./Navbar";

function App() {
  return (
    <BrowserRouter>

      {/* Navigation Bar */}
      <Navbar />

      <Routes>

        {/* Default Page */}
        <Route
          path="/"
          element={<Navigate to="/home" />}
        />

        {/* Authentication */}
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Main Pages */}
        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/books"
          element={<Books />}
        />

        <Route
          path="/add-book"
          element={<AddBook />}
        />

        <Route
          path="/requests"
          element={<Requests />}
        />

        {/* Invalid URL */}
        <Route
          path="*"
          element={<Navigate to="/home" />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;