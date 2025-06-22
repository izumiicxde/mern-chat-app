import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(400)
        .json({ message: "Unauthorized - No Token Provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(400).json({ message: "Unauthorized - Invalid Token." });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ message: "Unauthorized - User not found." });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in auth middleware: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in CheckAuth controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
