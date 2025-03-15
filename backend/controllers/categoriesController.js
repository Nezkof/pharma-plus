const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

// const getAllCategories = async (req, res) => {
//    try {
//       const query = `
//          SELECT categories.category_label
//          FROM categories
//          WHERE categories.category_label
//       `;

//       const { rows } = await pool.query(query);

//       res.render("categories-list", { categories: rows });
//    } catch (error) {
//       console.error(error);
//       res.status(500).send("Database error");
//    }
// };

const getFilteredCategories = async (req, res) => {
   try {
      const filter = req.query.filter || "";
      const query = `
         SELECT categories.category_label 
         FROM categories
         WHERE categories.category_label ILIKE $1
      `;

      const { rows } = await pool.query(query, [`%${filter}%`]);

      res.render("categories-catalog", { categories: rows });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

module.exports = {
   // getAllCategories,
   getFilteredCategories,
};
