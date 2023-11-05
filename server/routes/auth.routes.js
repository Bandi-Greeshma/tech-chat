const router = require("express").Router();

const {
  register,
  login,
  fetchUser,
  requestReset,
  reset,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/fetch", fetchUser);
router.post("/forgot/password", requestReset);
router.post("/reset/password", reset);

module.exports = router;
