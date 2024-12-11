const bcrypt = require("bcrypt");
const Admin = require("../models/admin.js");
const { createTokenForUser } = require("../services/authentication.js");
const User = require("../models/user.js");
const Blog = require("../models/blog.js");
const nodemailer = require("nodemailer");
const Notification = require("../models/notifications.js");

const signupAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    //checking for errors
    if (!fullName || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters Long" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ msg: "email already exists" });
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      fullName,
      email,
      password: hashedPassword,
    });
    await admin.save();

    return res.status(200).json({ msg: "Signup Successfull" });
  } catch (error) {
    console.log("Error during signup: ", error);

    return res.status(500).json({ msg: "Error while signing Up" });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const passCompare = await bcrypt.compare(password, admin.password);

    if (passCompare) {
      const token = createTokenForUser(admin);

      return res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "None", // Ensure this is set correctly
          secure: process.env.NODE_ENV === "production", // Set to true in production
        })
        .status(200)
        .json({ msg: "Login Successfull" });
    } else {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

const logoutAdmin = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ msg: "Logged Out successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching Users" });
    console.log(error);
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

const deleteUser = async (req, res) => {
  try {
    const id = req.body._id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"BLOGIFY" <anmolubisoft@gmail.com>`,
        to: user.email,
        subject: "Account Deletion Notification",
        text: `Dear ${user.fullName},
  
  We hope this message finds you well.
  
  We regret to inform you that your BLOGIFY account has been permanently deleted due to violation of our terms of service or policy.
  
  Please be assured that this decision was not made lightly, and we reviewed the situation thoroughly before reaching this conclusion. If you believe this action was taken in error or if you have any questions, feel free to contact us within 14 days of receiving this notification.
  
  We understand this may be disappointing news, and we apologize for any inconvenience caused. Thank you for being a part of BLOGIFY.
  
  Sincerely,
  The BLOGIFY Team`,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.log("Error sending email:", emailError.message);
    }

    await User.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Account Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error deleting user" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.body._id);

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"BLOGIFY" <anmolubisoft@gmail.com>`,
        to: blog.createdBy,
        subject: "Blog Deletion Notification",
        text: `Dear User,
  
  We hope this message finds you well.
  
  We regret to inform you that your blog post titled "${blog.title}" has been permanently removed from BLOGIFY due to a violation of our terms of service or community guidelines.
  
  Please be assured that this decision was made after careful consideration, and the content of your blog post was reviewed thoroughly. If you believe this action was taken in error or if you have any questions, feel free to reach out to us within 14 days of receiving this notification.
  
  We understand that this may be disappointing news, and we sincerely apologize for any inconvenience caused. Thank you for your understanding and for being a part of the BLOGIFY community.
  
  Sincerely,
  The BLOGIFY Team`,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.log("Error sending email:", emailError.message);
    }

    await Blog.findByIdAndDelete(req.body._id);
    return res.status(200).json({ msg: "Blog Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error deleting Blog" });
  }
};

const sendMail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"BLOGIFY" <anmolubisoft@gmail.com>`,
      to: req.body.message.to,
      subject: req.body.message.subject,
      text: req.body.message.body,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ msg: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error sending email" });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({});

    return res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching messages" });
    console.log(error);
  }
};

const getNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    if (notification) {
      notification.status = "read";
      await notification.save();
    }

    return res.status(200).json(notification);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error fetching notification" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.body._id);

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    await Notification.findByIdAndDelete(req.body._id);
    return res.status(200).json({ msg: "Notification Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error deleting notification" });
  }
};

const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    return res.status(200).json({ msg: "Notification Created Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error creating notification" });
  }
};

const getAllValues = async (req, res) => {
  try {
    const users = await User.find({});
    const blogs = await Blog.find({});
    const notifications = await Notification.find({});

    if (!users || !blogs || !notifications) {
      return res.status(404).json({ msg: "No data found" });
    }

    return res.status(200).json({ users, blogs, notifications });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error fetching data" });
  }
};

module.exports = {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
  getAllUsers,
  getAllBlogs,
  deleteUser,
  deleteBlog,
  sendMail,
  getAllNotifications,
  getNotification,
  deleteNotification,
  createNotification,
  getAllValues,
};
