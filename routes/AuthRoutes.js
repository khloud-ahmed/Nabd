// routes/AuthRoutes.js
const express = require("express");
const router = express.Router();

const { register, login ,logout } = require("../controllers/Authcontroller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
// Public Routes 
router.post("/register", register);
router.post("/login", login);
router.get("/logout",authMiddleware, logout);


// admins can access this
router.get(
  "/admin-only", 
  authMiddleware, 
  roleMiddleware("admin"), 
  (req, res) => {
    res.json({ msg: "Welcome Admin!", userId: req.userId });
  }
);

// doctors can access this
router.get(
  "/doctor-only",
  authMiddleware,
  roleMiddleware("doctor"),
  (req, res) => {
    res.json({ msg: "Welcome Doctor!", userId: req.userId });
  }
);

//  patients can access this
router.get(
  "/patient-only",
  authMiddleware,
  roleMiddleware("patient"),
  (req, res) => {
    res.json({ msg: "Welcome Patient!", userId: req.userId });
  }
);

module.exports = router;