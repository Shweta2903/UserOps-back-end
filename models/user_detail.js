const mongoose = require("mongoose");
const { Schema } = mongoose;

const userDetailSchema = new Schema(
  {
    address: String,
    city: String,
    age: Number,
    hobbies: String,
    mobile_no: Number,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

//User Details model
module.exports = mongoose.model(
  "UserDetail",
  userDetailSchema
);
