const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
// Connect to the MongoDB database (replace "your_mongodb_uri" with your actual MongoDB URI).
mongoose
  .connect("mongodb+srv://iconnect:iconnect123@cluster0.f1g98g0.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Create a Mongoose schema for the user data.
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Create a Mongoose model based on the schema.
const User = mongoose.model("User", userSchema);

// Middleware to parse JSON requests.
app.use(express.json());

// Login route.
app.post("/login", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database.
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ success: false });
    }

    // Validate the password.
    if (user.password === password) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ success: false, error: "An error occurred during login." });
  }
});

// Start the server.
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
