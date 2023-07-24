const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const PORT = 3000;
app.use(cors());

// MongoDB connection setup (replace "your_mongodb_uri" with your actual MongoDB URI).
mongoose
  .connect("mongodb+srv://iconnect:iconnect123@cluster0.f1g98g0.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB."))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Create a Mongoose schema for the user data.
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Create a Mongoose model based on the schema.
const User = mongoose.model("User", userSchema);

// Middleware to parse JSON requests.
app.use(express.json());

// Other routes and JWT implementation will go here.

// User registration route.
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists in the database.
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Hash the password before saving it to the database.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password.
    const newUser = new User({ username, password: hashedPassword });

    // Save the new user to the database.
    await newUser.save();

    return res.json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    return res
      .status(500)
      .json({ error: "An error occurred during registration." });
  }
});

// User login route.
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database based on the provided username.
    const user = await User.findOne({ username });

    // If the user is not found, return an error response.
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare the hashed password with the provided password.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the passwords don't match, return an error response.
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Generate a JWT token.
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "10s",
    });

    // Return the token as part of the response.
    return res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "An error occurred during login." });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
