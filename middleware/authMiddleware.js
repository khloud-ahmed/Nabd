const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
try {
// get Token From req.headers
const authHeaders = req.headers.authorization;
if (!authHeaders) return res.status(401).json({ msg: "Token Required"});
// Get Token Value -> String Token
const token = authHeaders.split(" ") [1]
// Token Value Verify -> payload
const payload = jwt.verify(token, process.env. JWT_SECRET);

// Store user data in request
req.user = { id: payload.id, 
    role: payload.role };
// next
next();
}catch (error){
 return res.status(401).json({ msg: "Token Invalid"});
}

}


module.exports = authMiddleware;