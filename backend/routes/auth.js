require("dotenv").config();
const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");

router.get(
   "/auth/google",
   passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
   "/auth/google/callback",
   passport.authenticate("google", { failureRedirect: "/" }),
   async (req, res) => {
      try {
         const clientId = await authController.setUserData(req, res);

         res.cookie("client_id", clientId, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
         });

         res.redirect(`http://localhost:${process.env.FRONTEND_PORT}`);
      } catch (error) {
         console.error("Error during authentication:", error);
         res.redirect(
            `http://localhost:${process.env.FRONTEND_PORT}?error=authentication_failed`
         );
      }
   }
);

router.get("/auth/get-client-id", authController.getCookie);

router.get("/auth/logout", (req, res) => {
   req.logout((err) => {
      if (err)
         return res.status(500).json({ message: "Logout failed", error: err });

      res.clearCookie("client_id");
      res.status(200).json({ message: "Logged out successfully" });
   });
});

module.exports = router;
