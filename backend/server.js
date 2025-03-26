const express = require("express");
const cors = require("cors");
const app = express();
const f1PointsRoutes = require("./routes/f1-points");

app.use(
  cors({
    origin: "https://ascchung.github.io/f1fantasy", // or full repo path
  })
);

app.use("/api/f1-points", f1PointsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
