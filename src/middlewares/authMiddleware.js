const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // "Bearer token"

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    // Ignore expiration Here ✅
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = authMiddleware;
