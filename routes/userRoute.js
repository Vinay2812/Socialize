const express = require("express");
const authMiddleWare = require("../Middleware/authMiddleWare")

const router = express.Router({strict: true});

const { getUser, updateUser, deleteUser, followUser, unfollowUser, getAllUser, searchUser } = require("../Controllers/UserController")

router.get("/:id", getUser);
router.post("/search", searchUser);
router.get("/", getAllUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);


module.exports = router