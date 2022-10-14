const express = require("express");
const authMiddleWare = require("../Middleware/authMiddleWare")

const router = express.Router();

const { getUser, updateUser, deleteUser, followUser, unfollowUser, getAllUser } = require("../Controllers/UserController")

router.get("/:id", getUser);
router.get("/", getAllUser);
router.patch("/:id", authMiddleWare, updateUser);
router.delete("/:id", authMiddleWare, deleteUser);
router.put("/:id/follow", authMiddleWare, followUser);
router.put("/:id/unfollow", authMiddleWare, unfollowUser);

module.exports = router