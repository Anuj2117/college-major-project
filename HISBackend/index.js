const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const { startSocketServer } = require("./socket");

// Import Middleware
const { isLoggedIn, isAdmin } = require("./middlewares/auth");

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

const app = express();
const PORT = 3001;

// middlewares
app.use(bodyParser.json());
app.use(cors());

// configure routes
app.use("/auth", authRoutes);
app.use("/admin", isLoggedIn, isAdmin, adminRoutes);
app.use("/user", isLoggedIn, userRoutes);

dotenv.config();

// connection to database
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(`Databse Connection Faield : ${err.message} `));

const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT} `)
);

startSocketServer(server);
