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
      const query = `
         select products.title, products.description, products.image 
         from products
         where products.product_id = $1
      `;

      const { rows } = await pool.query(query, [id]);

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
      const productQuery = `
         SELECT 
            products.title, 
            products.brand, 
            products.description, 
            categories.category_label
         FROM products
         INNER JOIN categories ON products.category_id = categories.category_id
         WHERE products.product_id = $1
      `;

      const pharmacyQuery = `
         SELECT 
            pharmacies.title AS pharmacy_name, 
            pharmacies.address, 
            pharmacies_products.price
         FROM pharmacies_products
         INNER JOIN pharmacies ON pharmacies.pharmacy_id = pharmacies_products.pharmacy_id
         WHERE pharmacies_products.product_id = $1
         AND (pharmacies.title ILIKE $2 OR pharmacies.address ILIKE $2)
      `;

      const [productResult, pharmacyResult] = await Promise.all([
         pool.query(productQuery, [id]),
         pool.query(pharmacyQuery, [id, `%${filter}%`]),
      ]);

      if (productResult.rows.length === 0) {
         return res.status(404).json({ error: "Продукт не знайдено" });
      }

      const product = productResult.rows[0];
      const pharmacies = pharmacyResult.rows;

      console.log({ product, pharmacies });

      res.render("product-details", { product, pharmacies });
   } catch (error) {
      console.error("Помилка отримання деталей продукту:", error);
      res.status(500).json({ error: "Fetch error" });
   }
};

module.exports = {
   getProductCardData,
   getProductDetails,
};
