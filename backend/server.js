const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const f1PointsRoutes = require("./routes/f1-points");

// ✅ Enable CORS for frontend
app.use(
  cors({
    origin: ["https://ascchung.github.io", "https://f1fantasy-o25v.onrender.com"],
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);

// Serve static files from React build
app.use(express.static(path.join(__dirname, "../build")));

// API routes
app.use("/api/f1-points", f1PointsRoutes);

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
