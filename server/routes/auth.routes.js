const router = require("express").Router();

const {
  register,
  login,
  fetchUser,
  requestReset,
  reset,
} = require("../controllers/auth.controller");
const { checkAuth } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/fetch", checkAuth, fetchUser);
router.post("/forgot/password", requestReset);
router.post("/reset/password", reset);

module.exports = router;
