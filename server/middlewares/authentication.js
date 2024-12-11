const { validateToken } = require("../services/authentication.js");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return res.status(401).json({ msg: "Please Login First" });
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
      next();
    } catch (error) {
      res.status(500).json({ msg: "token is not valid" });
    }
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
