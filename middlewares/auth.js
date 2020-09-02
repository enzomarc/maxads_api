const jwt = require('jsonwebtoken');
const Constants = require('../utils/constants');
const User = require('../models/user');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ message: "Unable to load the resource. Invalid authorization header." });

  jwt.verify(token, Constants.AUTH_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid token provided." });

    console.log('Decoded: ' + decoded.phone);
    return next();
  });
}