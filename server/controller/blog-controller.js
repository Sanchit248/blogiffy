const Blog = require("../models/blog.js");
const cloudinary = require("../services/cloudinary.js");

const uploadImage = async (req, res) => {
  try {
    const image_url = req.body.image_url;

    const cloudinary_res = await cloudinary.uploader.upload(image_url, {
      folder: "/Blogging",
    });

    // Send only the URL of the uploaded image
    return res.status(200).send({ url: cloudinary_res.secure_url });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to upload image" });
  }
};

const createBlog = async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
    });

    await blog.save();

    return res.status(200).json({ msg: "Blog Created Successfully" });
  } catch (error) {
    console.log("Error during blog creation: ", error);

    return res.status(500).json({ msg: "Error while creating blog" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});

    return res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching Blogs" });
    console.log(error);
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching Blog" });
    console.log(error);
  }
};

const updateBlog = async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      category: req.body.category,
    });

    return res.status(200).json({ msg: "Blog updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error updating Blog" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    return res.status(200).json({ msg: "Blog deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error deleting Blog" });
  }
};

const likeBlog = async (req, res) => {
  try {
    const blogId = await Blog.findById(req.params.id);
    const userId = req.body.userId;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const isLiked = blog.likedBy.includes(userId);

    if (isLiked) {
      blog.likedBy.splice(blog.likedBy.indexOf(userId), 1);
    } else {
      blog.likedBy.push(userId);
    }

    await blog.save();

    return res.status(200).json({ msg: "Like updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Error updating like" });
  }
};

module.exports = {
  uploadImage,
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
};
