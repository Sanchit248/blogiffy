const { Router } = require("express");
const {
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
} = require("../controller/admin-controller.js");

const router = Router();

router.post("/signupAdmin", signupAdmin);
router.post("/loginAdmin", loginAdmin);
router.post("/logoutAdmin", logoutAdmin);
router.get("/admin/getAllUsers", getAllUsers);
router.get("/admin/getAllBlogs", getAllBlogs);
router.post("/admin/deleteUser", deleteUser);
router.post("/admin/deleteBlog", deleteBlog);
router.post("/admin/sendMail", sendMail);
router.get("/admin/getAllNotifications", getAllNotifications);
router.get("/admin/getNotification/:id", getNotification);
router.post("/admin/deleteNotification", deleteNotification);
router.post("/admin/createNotification", createNotification);
router.get("/admin/getAllValues", getAllValues);

module.exports = router;
