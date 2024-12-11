const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { createTokenForUser } = require("../services/authentication.js");

const signupUser = async (req, res) => {
  try {
    const { fullName, email, password, profileImageUrl } = req.body;

    //checking for errors
    if (!fullName || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters Long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "email already exists" });
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultImg =
      "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?w=740&t=st=1724059808~exp=1724060408~hmac=9a73841f17cb037e22557809af861a7e999b1a6c42b0a6b82d614b51e306f6fa";

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      profileImageUrl: profileImageUrl || defaultImg,
    });
    await user.save();

    return res.status(200).json({ msg: "Signup Successfull" });
  } catch (error) {
    console.log("Error during signup: ", error);

    return res.status(500).json({ msg: "Error while signing Up" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const passCompare = await bcrypt.compare(password, user.password);

    if (passCompare) {
      const token = createTokenForUser(user);

      return res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "None", // Ensure this is set correctly
          secure: process.env.NODE_ENV === "production", // Set to true in production
        })
        .status(200)
        .json({ msg: "Login Successfull" });
    } else {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

const getUserData = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.clearCookie("token");
      return res.status(400).json({ msg: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error fetching user details: ", error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ msg: "Logged Out successfully" });
};

module.exports = {
  signupUser,
  loginUser,
  getUserData,
  logoutUser,
};
