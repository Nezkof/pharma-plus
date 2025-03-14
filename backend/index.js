const express = require("express");
const path = require("path");
require("dotenv").config({
   override: true,
   path: path.join(__dirname, ".env"),
});
const categoriesRoutes = require("./routes/categories");
const catalogRoutes = require("./routes/catalog");
const cors = require("cors");

const app = express();
const port = 8000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/categories", categoriesRoutes);
app.use("/catalog", catalogRoutes);

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
});
