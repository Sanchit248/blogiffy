const Comment = require("../models/comment");

const createComment = async (req, res) => {
  try {
    const comment = new Comment({
      ...req.body,
    });

    await comment.save();

    return res.status(200).json({ msg: "Comment added successfully" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "Failed to add comment" });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id });

    return res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to fetch comments" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const result = await Comment.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    return res.status(200).json({ msg: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to delete comment" });
  }
};

module.exports = { createComment, getComments, deleteComment };
