const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getCategories = async (req, res) => {
   try {
      const { rows } = await pool.query("select * from categories");
      res.render("admin/admin-categories.ejs", { categories: rows });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const addCategory = async (req, res) => {
   try {
      const { category_label, category_image } = req.body;

      if (!category_label || !category_image) {
         return res
            .status(400)
            .json({ success: false, message: "Дані відсутні" });
      }

      await pool.query(
         `INSERT INTO public.categories (category_label, category_image) VALUES ($1, $2)`,
         [category_label, category_image]
      );

      res.json({ success: true, message: "Категорію додано" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const deleteCategory = async (req, res) => {
   try {
      const { id } = req.params;

      if (!id) {
         return res
            .status(400)
            .json({ success: false, message: "ID категорії обов'язковий!" });
      }

      await pool.query(`DELETE FROM public.categories WHERE category_id = $1`, [
         id,
      ]);

      res.json({ success: true, message: "Категорію видалено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const updateCategory = async (req, res) => {
   try {
      const { category_id } = req.params;
      const { label, image } = req.body;

      if (!label || !image) {
         return res
            .status(400)
            .json({ success: false, message: "Всі поля обов'язкові!" });
      }

      await pool.query(
         `UPDATE public.categories SET category_label = $1, category_image = $2 WHERE category_id = $3`,
         [label, image, category_id]
      );

      res.json({ success: true, message: "Категорію оновлено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

module.exports = {
   getCategories,
   addCategory,
   deleteCategory,
   updateCategory,
};
