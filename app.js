const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
// const UserDetail = require("./routes/user_details");
const cors = require("cors");
const User = require("./models/user");

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use("/api/users", userRoutes);
// app.use("/api/user-details", UserDetail);

// const aggregate = User.aggregate([
//   {
//     $group: {
//       _id: "$email",
//       detail: { $push: "$$ROOT" },
//     },
//   },
// ]);
// console.log(aggregate);

mongoose
  .connect("mongodb://127.0.0.1:27017/users")
  .then(() => {
    console.log("DB CONNECTED");
  });

app.listen(port, () => {
  console.log(
    `Server is running on port ${port}`
  );
});
