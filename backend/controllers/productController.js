const {
   productCardDataQuery,
   productQuery,
   pharmacyQuery,
} = require("../queries/queries.js");

const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getProductCardData = async (req, res) => {
   const { id } = req.params;

   try {
      const { rows } = await pool.query(productCardDataQuery, [id]);

      const product = rows[0];

      res.render("product-card-large", { product });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Fetch error" });
   }
};

const getProductDetails = async (req, res) => {
   const { id } = req.params;
   const filter = req.query.filter || "";

   try {
      const [productResult, pharmacyResult] = await Promise.all([
         pool.query(productQuery, [id]),
         pool.query(pharmacyQuery, [id, `%${filter}%`]),
      ]);

      if (productResult.rows.length === 0) {
         return res.status(404).json({ error: "Product not found" });
      }

      const product = productResult.rows[0];
      const pharmacies = pharmacyResult.rows;

      console.log({ product, pharmacies });

      res.render("product-details", { product, pharmacies });
   } catch (error) {
      console.error("Product getting data error:", error);
      res.status(500).json({ error: "Fetch error" });
   }
};

module.exports = {
   getProductCardData,
   getProductDetails,
};
