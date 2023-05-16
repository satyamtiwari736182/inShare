const express = require("express");
const path = require("path");
const app = express();

const connectDB = require("./config/db");
const cors = require('cors');
connectDB();
// Cors 
const corsOptions = {
  // origin: process.env.ALLOWED_CLIENTS.split(',')
  origin: ['http://127.0.0.1:3100', 'http://127.0.0.1:5500', 'http://localhost:3100', 'http://localhost:5500'],
  Credential: true
}
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json());

//TODO Template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//TODO  Routes
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
