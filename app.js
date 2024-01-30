require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
const port = process.env.PORT;
const cors = require("cors");

const authRoutes = require("./routes/auth");
const protectedRoute = require("./routes/protectedRoute");

app.use(cors());

// middleWare
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
// middleWare

app.use("/auth", authRoutes);
app.use("/protected", protectedRoute);

mongoose
  .connect(uri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Connected to MongoDb && start server on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
