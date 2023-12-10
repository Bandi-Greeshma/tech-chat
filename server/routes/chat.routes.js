const router = require("express").Router();

const { checkAuth } = require("../middlewares/auth.middleware");
const { addNewChat } = require("../controllers/chat.controller");

router.post("/add", checkAuth, addNewChat);

module.exports = router;
