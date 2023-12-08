const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserDetail = require("../models/user_detail");
const mongoose = require("mongoose");

// Create user
router.post("/", async (req, res) => {
  try {
    const { body } = req;
    const newUser = await User.create({
      name: body.name,
      lastname: body.lastname,
      email: body.email,
      password: body.password,
    });

    await UserDetail.create({
      user_id: newUser._id,
      address: body.address,
      city: body.city,
      age: body.age,
      hobbies: body.hobbies,
      mobile_no: body.mobile,
    });

    res.status(201).json({
      message: "User Created successfully....",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while creating user",
      error: error.message,
    });
  }
});

//Get users
router.get("/", async (req, res) => {
  const searchData = req.query.searchData;
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "userdetails",
          localField: "_id",
          foreignField: "user_id",
          as: "userDetails",
        },
      },
      {
        $match: {
          $or: [
            {
              name: {
                $regex: new RegExp(searchData, "i"),
              },
            },
            {
              email: {
                $regex: new RegExp(searchData, "i"),
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while getting user",
      error: error.message,
    });
  }
});

//update user
router.put("/:userID", async (req, res) => {
  try {
    const userId = req.params.userID;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid ObjectId formate");
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true }
    );

    await UserDetail.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(userId),
      },
      {
        address: req.body.address,
        city: req.body.city,
        age: req.body.age,
        hobbies: req.body.hobbies,
        mobile_no: req.body.mobile,
      },
      { new: true }
    );
    console.log("body:", req.body);
    res.status(200).json({
      message: "User updates successfully..",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in update data..",
      error: error.message,
    });
  }
});

router.get("/:userID", async (req, res) => {
  try {
    const userID = new mongoose.Types.ObjectId(req.params.userID);

    const users = await User.aggregate([
      {
        $lookup: {
          from: "userdetails",
          localField: "_id",
          foreignField: "user_id",
          as: "userDetails",
        },
      },
      {
        $match: {
          _id: userID,
        },
      },
    ]);
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("🚀 ~ file: user.js:153 ~ router.get ~ error:", error);
    res.status(500).json({
      message: "Error while getting user",
      error: error.message,
    });
  }
});

router.delete("/delete/:userID", async (req, res) => {
  try {
    const userID = new mongoose.Types.ObjectId(req.params.userID);

    const deleteUser = await User.deleteOne({
      _id: userID,
    });
    await UserDetail.deleteOne({
      _id: userID,
    });

    res.status(200).json({
      message: "User Deleted Successfully....",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting user",
      error: error.message,
    });
  }
});

module.exports = router;
