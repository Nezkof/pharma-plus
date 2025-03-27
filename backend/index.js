require("dotenv").config();

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const path = require("path");
require("dotenv").config({
   override: true,
   path: path.join(__dirname, ".env"),
});

const citiesListRoutes = require("./routes/citiesList");
const categoriesRoutes = require("./routes/categories");
const catalogRoutes = require("./routes/catalog");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const authRouter = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const cors = require("cors");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(
   cors({
      origin: "http://localhost:3000",
      credentials: true,
   })
);
app.use(express.json());
app.use(cookieParser());

app.use(
   session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
   })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: `http://localhost:${process.env.BACKEND_PORT}/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
         return done(null, profile);
      }
   )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use("/", authRouter);
app.use("/user", userRoutes);
app.use("/citiesList", citiesListRoutes);
app.use("/categories", categoriesRoutes);
app.use("/catalog", catalogRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);

app.use("/admin", adminRoutes);

app.listen(process.env.BACKEND_PORT, () => {
   console.log(
      `Server running at http://localhost:${process.env.BACKEND_PORT}`
   );
});
