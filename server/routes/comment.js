const { Router } = require("express");
const {
  createComment,
  getComments,
  deleteComment,
} = require("../controller/comment-controller");

const router = Router();

router.post("/comment", createComment);
router.get("/comments/:id", getComments);
router.delete("/comment/:id", deleteComment);

module.exports = router;
