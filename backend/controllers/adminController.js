const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getAdminPage = async (req, res) => {
   try {
      res.render("admin/admin-page.ejs");
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

module.exports = {
   getAdminPage,
};
