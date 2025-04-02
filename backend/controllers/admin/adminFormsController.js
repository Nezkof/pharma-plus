const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getForms = async (req, res) => {
   try {
      const { rows } = await pool.query("select * from forms");
      res.render("admin/admin-forms.ejs", { forms: rows });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const getFormsJSON = async (req, res) => {
   try {
      const { rows } = await pool.query("select * from forms");
      res.json(rows);
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const addForm = async (req, res) => {
   try {
      const { label } = req.body;

      if (!label) {
         return res
            .status(400)
            .json({ success: false, message: "Дані відсутні" });
      }

      await pool.query(`INSERT INTO public.forms (form_label) VALUES ($1)`, [
         label,
      ]);

      res.json({ success: true, message: "Форму додано" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const deleteForm = async (req, res) => {
   try {
      const { id } = req.params;

      if (!id) {
         return res
            .status(400)
            .json({ success: false, message: "ID обов'язковий!" });
      }

      await pool.query(`DELETE FROM public.forms WHERE form_id = $1`, [id]);

      res.json({ success: true, message: "Форму видалено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const updateForm = async (req, res) => {
   try {
      const { id } = req.params;
      const { newLabel } = req.body;

      if (!newLabel) {
         return res
            .status(400)
            .json({ success: false, message: "Всі поля обов'язкові!" });
      }

      await pool.query(
         `UPDATE public.forms SET form_label = $1 WHERE form_id = $2`,
         [newLabel, id]
      );

      res.json({ success: true, message: "Форму оновлено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

module.exports = {
   getFormsJSON,
   getForms,
   addForm,
   deleteForm,
   updateForm,
};
