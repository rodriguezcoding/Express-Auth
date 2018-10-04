const jwt = require("jsonwebtoken");
function authToken(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Unauthorized. No token provided");

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY_GEN_TOKEN);
    req.user = decode;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}

module.exports = authToken;
