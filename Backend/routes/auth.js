const authControllers = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const passport = require("passport");

const router = require("express").Router();

router.post(
  "/register",
  authControllers.registerUser,
  authControllers.sendActiveAccountMail
);
router.post("/login", authControllers.loginUser);
router.post("/refresh", authControllers.requestRefreshToken);
router.post("/logout", authMiddleware.verifyToken, authControllers.logOut);
// router.post("/password/forgot", authControllers.forgotPassword);
// router.put("/password/reset/:token", authControllers.resetPassword);
router.post("/forgot-password", authControllers.forgotPassword);
router.post("/verify", authControllers.verifyResetToken);
router.put("/password/reset/", authControllers.resetPassword);
router.post("/accout-activate", authControllers.verifyActiveAccount);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect(`${process.env.BASE_URL}:3000/${req.user._id}`);
  }
);

module.exports = router;
