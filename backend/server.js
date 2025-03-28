const cors = require("cors");
const express = require("express");
const app = express();
const f1PointsRoutes = require("./routes/f1-points");

// ✅ Fix CORS to allow GitHub Pages frontend
app.use(
  cors({
    origin: "https://ascchung.github.io", // <-- this is the actual Origin GitHub Pages sends
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/f1-points", f1PointsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
