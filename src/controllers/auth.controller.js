const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const signToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ first_name, last_name, email, password });
    const token = signToken(user);
    res.status(201).json({ user: { id: user._id, first_name, last_name, email }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ user: { id: user._id, first_name: user.first_name, last_name: user.last_name, email }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
