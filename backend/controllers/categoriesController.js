const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getAllCategories = async (req, res) => {
   try {
      const { rows } = await pool.query(
         "SELECT categories.category_label FROM categories"
      );
      return res.json(rows);
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

module.exports = {
   getAllCategories,
};
