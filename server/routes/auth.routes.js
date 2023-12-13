const router = require("express").Router();

const {
  register,
  login,
  fetchUser,
  requestReset,
  resetPassword,
} = require("../controllers/auth.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.route("/login").post(login).get(protectRoute, fetchUser);
router.post("/forgot/password", requestReset);
router.post("/reset/password", resetPassword);

module.exports = router;
