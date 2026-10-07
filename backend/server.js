const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
  override: true,
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Book = require("./models/Book");
const Request = require("./models/Request");

const app = express();


// ==================== MIDDLEWARE ====================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());


// ==================== MONGODB CONNECTION ====================

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    tls: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
  });


// ==================== TEST ROUTE ====================

app.get("/", (req, res) => {
  res.json({
    message: "BookLoop API is running!",
  });
});


// ==================== REGISTER ====================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});


// ==================== LOGIN ====================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});


// ==================== ADD BOOK ====================

app.post("/api/books", async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      category,
      type,
      owner,
    } = req.body;

    if (!title || !author || !owner) {
      return res.status(400).json({
        message: "Title, author and owner are required",
      });
    }

    const book = await Book.create({
      title,
      author,
      description: description || "",
      category: category || "Other",
      type: type || "Exchange",
      owner,
    });

    res.status(201).json({
      message: "Book added successfully",
      book,
    });

  } catch (error) {
    console.error("ADD BOOK ERROR:", error);

    res.status(500).json({
      message: "Failed to add book",
      error: error.message,
    });
  }
});


// ==================== GET ALL BOOKS ====================

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(books);

  } catch (error) {
    console.error("GET BOOKS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});


// ==================== CREATE REQUEST ====================

app.post("/api/requests", async (req, res) => {
  try {
    const {
      book,
      requester,
      owner,
      type,
    } = req.body;

    if (!book || !requester || !owner || !type) {
      return res.status(400).json({
        message:
          "Book, requester, owner and type are required",
      });
    }

    // Prevent requesting your own book
    if (requester === owner) {
      return res.status(400).json({
        message: "You cannot request your own book",
      });
    }

    // Check for an existing pending request
    const existingRequest = await Request.findOne({
      book,
      requester,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already exists",
      });
    }

    const request = await Request.create({
      book,
      requester,
      owner,
      type,
    });

    res.status(201).json({
      message: "Request submitted successfully",
      request,
    });

  } catch (error) {
    console.error("CREATE REQUEST ERROR:", error);

    res.status(500).json({
      message: "Failed to create request",
      error: error.message,
    });
  }
});


// ==================== GET MY REQUESTS ====================

app.get("/api/requests/:userId", async (req, res) => {
  try {
    const requests = await Request.find({
      requester: req.params.userId,
    })
      .populate("book", "title author category type")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {
    console.error("GET REQUESTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
});


// ==================== SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});