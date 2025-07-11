import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (
      !email ||
      !password ||
      !fullName ||
      typeof password !== "string" ||
      typeof email !== "string" ||
      typeof fullName !== "string"
    )
      return res.status(400).json({ message: "Invalid request data." });

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate jwt token after user is created
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: "New User Created",
        _id: newUser._id,
        fullName: newUser.fullName,
        email: user.email,
        profilePic: newUser.profilePic,
      });
    } else res.status(400).json({ message: "Invalid user data" });
  } catch (error) {
    console.log("Error while creating the user in signup controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      !email ||
      !password ||
      typeof password !== "string" ||
      typeof email !== "string"
    )
      return res.status(400).json({ message: "Invalid request data." });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    return res.status(200).json({
      message: "Login Successfull",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error logging in the user in login controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: "0" });
    res.status(200).json({ message: "Logout successfull" });
  } catch (error) {
    console.log("Error logging out in logout controller: ", error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res
        .status(400)
        .json({ message: "Invalid data - image is required." });

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    );
    return res.status(200).json({
      message: "user profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error uploading and updating the profile pic: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
