const express = require("express");
const carRoutes = require("./routes/carRoutes");
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration for file uploads
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

app.use("/api/cars", upload.single("image"), carRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
