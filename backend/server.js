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

// API routes first
app.use("/api/f1-points", f1PointsRoutes);

// Serve static files from React build (if exists)
const buildPath = path.join(__dirname, "../build");
if (require("fs").existsSync(buildPath)) {
  app.use(express.static(buildPath));
  
  // Serve React app for all other routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  // Fallback if build doesn't exist
  app.get("*", (req, res) => {
    res.json({ 
      message: "F1 Fantasy API is running! Frontend build not found.", 
      api: "/api/f1-points",
      buildPath: buildPath
    });
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
