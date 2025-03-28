const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getProducts = async (req, res) => {
   try {
      const productsResult = await pool.query(`
         SELECT products.product_id, products.title, products.description, 
                application_methods.application_methods_label, products.brand, products.image, 
                forms.form_label, categories.category_label, categories.category_id
         FROM products
         INNER JOIN products_application_methods 
            ON products_application_methods.product_id = products.product_id
         INNER JOIN application_methods 
            ON products_application_methods.application_methods_id = application_methods.application_methods_id
         INNER JOIN products_forms 
            ON products_forms.product_id = products.product_id
         INNER JOIN forms 
            ON products_forms.form_id = forms.form_id
         INNER JOIN products_categories 
            ON products_categories.product_id = products.product_id
         INNER JOIN categories 
            ON categories.category_id = products_categories.category_id
      `);

      const categoriesResult = await pool.query(`SELECT * FROM categories`);

      const applicationMethodsResult = await pool.query(
         `SELECT * FROM application_methods`
      );

      const formsResult = await pool.query(`SELECT * FROM forms`);

      res.render("admin/admin-products.ejs", {
         products: productsResult.rows,
         categories: categoriesResult.rows,
         applicationMethods: applicationMethodsResult.rows,
         forms: formsResult.rows,
      });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const addProduct = async (req, res) => {
   try {
      const {
         title,
         description,
         application_method_id,
         form_id,
         category_id,
         brand,
         image,
      } = req.body;

      if (
         !title ||
         !description ||
         !application_method_id ||
         !form_id ||
         !category_id ||
         !brand ||
         !image
      ) {
         return res
            .status(400)
            .json({ success: false, message: "Не всі дані передано" });
      }

      const result = await pool.query(
         `INSERT INTO public.products (title, description, application_id, form_id, category_id, image, brand) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING product_id`,
         [
            title,
            description,
            application_method_id,
            form_id,
            category_id,
            brand,
            image,
         ]
      );

      const productId = result.rows[0].product_id;

      await pool.query(
         `INSERT INTO public.products_forms (product_id, form_id) VALUES ($1, $2)`,
         [productId, form_id]
      );

      await pool.query(
         `INSERT INTO public.products_application_methods (product_id, application_methods_id) VALUES ($1, $2)`,
         [productId, application_method_id]
      );

      await pool.query(
         `INSERT INTO public.products_categories (product_id, category_id) VALUES ($1, $2)`,
         [productId, category_id]
      );

      res.json({ success: true, message: "Продукт додано" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const deleteProduct = async (req, res) => {
   try {
      const { id } = req.params;

      if (!id) {
         return res
            .status(400)
            .json({ success: false, message: "ID продукту обов'язковий!" });
      }

      await pool.query(
         `DELETE FROM public.products_forms WHERE product_id = $1`,
         [id]
      );

      await pool.query(
         `DELETE FROM public.products_application_methods WHERE product_id = $1`,
         [id]
      );

      await pool.query(
         `DELETE FROM public.products_categories WHERE product_id = $1`,
         [id]
      );

      await pool.query(`DELETE FROM public.products WHERE product_id = $1`, [
         id,
      ]);

      res.json({ success: true, message: "Продукт видалено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const updateProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const {
         newLabel,
         newDescription,
         newApplicationMethod,
         newForm,
         newCategory,
         newBrand,
         newImage,
      } = req.body;

      console.log("ID продукту:", id);
      console.log("Отримані дані:", req.body);

      if (
         !newLabel ||
         !newDescription ||
         !newApplicationMethod ||
         !newForm ||
         !newCategory ||
         !newBrand ||
         !newImage
      ) {
         return res
            .status(400)
            .json({ success: false, message: "Всі поля обов'язкові!" });
      }

      await pool.query("BEGIN");

      await pool.query(
         `UPDATE public.products 
            SET title = $1, description = $2, brand = $3, image = $4
            WHERE product_id = $5`,
         [newLabel, newDescription, newBrand, newImage, id]
      );

      await pool.query(
         `UPDATE public.products_forms 
            SET form_id = $1
            WHERE product_id = $2`,
         [newForm, id]
      );

      await pool.query(
         `UPDATE public.products_application_methods 
            SET application_methods_id = $1
            WHERE product_id = $2`,
         [newApplicationMethod, id]
      );

      await pool.query(
         `UPDATE public.products_categories 
            SET category_id = $1
            WHERE product_id = $2`,
         [newCategory, id]
      );

      await pool.query("COMMIT");

      res.json({ success: true, message: "Продукт оновлено!" });
   } catch (error) {
      await pool.query("ROLLBACK");
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

module.exports = {
   getProducts,
   addProduct,
   deleteProduct,
   updateProduct,
};
