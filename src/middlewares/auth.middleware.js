// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });

    // Accept both "Bearer <token>" or just "<token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token)
      return res.status(401).json({ error: "Invalid token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ error: "User not found" });

    req.user = user; // attach full user object to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
