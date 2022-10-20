const express = require("express");
const authMiddleWare = require("../Middleware/authMiddleWare")

const router = express.Router({strict: true});

const { getUser, updateUser, deleteUser, requestUser, acceptUser, rejectUser, unfollowUser, getAllUser, searchUser, cancelRequest } = require("../Controllers/UserController")

router.get("/:id", getUser);
router.post("/search", searchUser);
router.get("/", getAllUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/request", requestUser);
router.put("/:id/cancel", cancelRequest);
router.put("/:id/accept", acceptUser);
router.put("/:id/reject", rejectUser);
router.put("/:id/unfollow", unfollowUser);


module.exports = router