const express = require("express");
const { createPost, getPost, deletePost, updatePost, likePost, getTimeLinePosts, addComment, deleteComment } = require("../Controllers/PostController");
const router = express.Router();

router.post("/", createPost);
router.patch("/:id", updatePost);
router.get("/:id", getPost);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);
router.get("/:id/timeline", getTimeLinePosts);
router.put("/:id/comment", addComment);
router.put("/:id/uncomment", deleteComment);

module.exports = router