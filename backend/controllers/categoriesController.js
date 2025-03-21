const { filteredCategoriesQuery } = require("../queries/queries.js");

const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getFilteredCategories = async (req, res) => {
   try {
      const filter = req.query.filter || "";

      const { rows } = await pool.query(filteredCategoriesQuery, [
         `%${filter}%`,
      ]);

      console.log(rows);

      res.render("categories-catalog", { categories: rows });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

module.exports = {
   getFilteredCategories,
};
