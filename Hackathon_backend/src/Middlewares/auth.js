const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model.js")
require("dotenv").config();

const Authenticated = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.json({ message: "Login first" });

  const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET);

  const id = decoded.userId;

  let user = await Admin.findById(id);

  if (!user) return res.json({ message: "User not exist" });

  req.user = user;
  next();
};

module.exports = Authenticated;

// const jwt = require('jsonwebtoken')
// const { config } = require('../configs/server.config.js')

// const checkAuth = (req, res, next) => {
//     try {
//         const token = req.header('Authorization')
//         if (!token) {
//             return res.status(401).json({ success: false, message: 'unauthorized', data: null })
//         }
//         // Bearer sjjklagldjfklgjsdkljklsdjklgsdjkl
//         const isValid = jwt.verify(token.slice(7), config.secretKey)
//         console.log(isValid)
//         next()
//     } catch (error) {
//         return res.status(401).json({ success: false, message: 'unauthorized', data: error })
//     }
// }

// module.exports = {
//     checkAuth
// }