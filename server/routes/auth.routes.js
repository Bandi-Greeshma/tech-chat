const router = require("express").Router();

const {
  register,
  login,
  requestReset,
  resetPassword,
} = require("../controllers/auth.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot/password", requestReset);
router.post("/reset/password", resetPassword);

module.exports = router;
