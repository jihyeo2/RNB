const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function (req, res, next) {
  const token = await req.header("x-auth-token");
  if (!token) return res.status(401).send("auth_m: Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey")); //decoded payload if valid
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("auth_m: Invalid token."); // this automatically terminates the call
  }
};
