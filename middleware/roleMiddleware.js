const jwt = require("jsonwebtoken");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists and has role
      if (!req.user || !req.user.role) {
        return res.status(403).json({ msg: "Access Denied: No role found" });
      }

      const userRole = req.user.role;

      // Check if user role is allowed
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          msg: `Access Denied: ${userRole} role not authorized`,
          allowedRoles: allowedRoles
        });
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  };
};

module.exports = roleMiddleware;