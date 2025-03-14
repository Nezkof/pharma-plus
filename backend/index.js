const express = require("express");
const path = require("path");
require("dotenv").config({
   override: true,
   path: path.join(__dirname, ".env"),
});
const categoriesRoutes = require("./routes/categories");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use("/categories", categoriesRoutes);

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
});
