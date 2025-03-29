const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getPharmacyProducts = async (req, res) => {
   try {
      const pharmacyProductResult = await pool.query(`
         SELECT pharmacies_products.pharmacy_product_id, products.title, pharmacies_products.price, pharmacies.title as pharma_title
	      FROM public.pharmacies_products
         inner join products on products.product_id = pharmacies_products.product_id
         inner join pharmacies on pharmacies.pharmacy_id = pharmacies_products.pharmacy_id
      `);

      const productResult = await pool.query(`select * from products`);
      const pharmacyResult = await pool.query(`select * from pharmacies`);

      res.render("admin/admin-pharmacy-products.ejs", {
         pharmacyProduct: pharmacyProductResult.rows,
         products: productResult.rows,
         pharmacies: pharmacyResult.rows,
      });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const addPharmacyProduct = async (req, res) => {
   try {
      const { product_id, price, pharmacy_id } = req.body;

      console.log(req.body);

      if (!product_id || !price || !pharmacy_id) {
         return res
            .status(400)
            .json({ success: false, message: "Не всі дані передано" });
      }

      const result = await pool.query(
         `INSERT INTO public.pharmacies_products (price, pharmacy_id, product_id) VALUES ($1, $2, $3) `,
         [price, pharmacy_id, product_id]
      );

      res.json({ success: true, message: "Продукт додано" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const deletePharmacyProduct = async (req, res) => {
   try {
      const { id } = req.params;

      if (!id) {
         return res
            .status(400)
            .json({ success: false, message: "ID продукту обов'язковий!" });
      }

      await pool.query(
         `DELETE FROM public.pharmacies_products WHERE pharmacy_product_id = $1`,
         [id]
      );

      res.json({ success: true, message: "Продукт видалено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const updatePharmacyProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const { newLabel, newPharmacy, newProduct } = req.body;

      console.log("ID продукту:", id);
      console.log("Отримані дані:", req.body);

      if (!newLabel || !newPharmacy || !newProduct) {
         return res
            .status(400)
            .json({ success: false, message: "Всі поля обов'язкові!" });
      }

      await pool.query(
         `UPDATE public.pharmacies_products
            SET price = $1,pharmacy_id = $2,product_id = $3
            WHERE pharmacy_product_id = $4`,
         [newLabel, newPharmacy, newProduct, id]
      );

      res.json({ success: true, message: "Продукт оновлено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

module.exports = {
   getPharmacyProducts,
   addPharmacyProduct,
   deletePharmacyProduct,
   updatePharmacyProduct,
};
