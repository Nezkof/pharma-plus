const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getApplicationMethods = async (req, res) => {
   try {
      const { rows } = await pool.query("select * from application_methods");

      res.render("admin/admin-methods.ejs", { methods: rows });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const getApplicationMethodsJSON = async (req, res) => {
   try {
      const { rows } = await pool.query("select * from application_methods");
      res.json(rows);
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const addApplicationMethod = async (req, res) => {
   try {
      const { label } = req.body;

      if (!label) {
         return res
            .status(400)
            .json({ success: false, message: "Дані відсутні" });
      }

      await pool.query(
         `INSERT INTO public.application_methods (application_methods_label) VALUES ($1)`,
         [label]
      );

      res.json({ success: true, message: "Метод застосування додано" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const deleteApplicationMethod = async (req, res) => {
   try {
      const { id } = req.params;

      if (!id) {
         return res
            .status(400)
            .json({ success: false, message: "ID обов'язковий!" });
      }

      await pool.query(
         `DELETE FROM public.application_methods WHERE application_methods_id = $1`,
         [id]
      );

      res.json({ success: true, message: "Категорію видалено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const updateApplicationMethod = async (req, res) => {
   try {
      const { id } = req.params;
      const { newLabel } = req.body;

      if (!newLabel) {
         return res
            .status(400)
            .json({ success: false, message: "Всі поля обов'язкові!" });
      }

      await pool.query(
         `UPDATE public.application_methods SET application_methods_label = $1 WHERE application_methods_id = $2`,
         [newLabel, id]
      );

      res.json({ success: true, message: "Категорію оновлено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

module.exports = {
   getApplicationMethods,
   getApplicationMethodsJSON,
   addApplicationMethod,
   deleteApplicationMethod,
   updateApplicationMethod,
};
