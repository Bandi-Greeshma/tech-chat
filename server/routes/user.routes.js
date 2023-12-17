const {
  fetchUser,
  updateUser,
  deleteUser,
  updatePassword,
  parseImage,
} = require("../controllers/user.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.patch("/password", protectRoute, updatePassword);

router
  .route("/")
  .get(protectRoute, fetchUser)
  .patch(protectRoute, parseImage, updateUser)
  .delete(protectRoute, deleteUser);

module.exports = router;
