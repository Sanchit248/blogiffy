const { Router } = require("express");
const {
  signupUser,
  loginUser,
  getUserData,
  logoutUser,
} = require("../controller/user-contoller.js");

const { uploadImage } = require("../controller/blog-controller.js");

const router = Router();

router.post("/uploadAvatar", uploadImage);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/userData", getUserData);
router.post("/logout", logoutUser);

module.exports = router;
