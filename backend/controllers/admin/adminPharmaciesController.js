const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getPharmacies = async (req, res) => {
   try {
      const { rows } = await pool.query("select * from pharmacies");
      res.render("admin/admin-pharmacies.ejs", { pharmacies: rows });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const addPharmacy = async (req, res) => {
   try {
      const { label, address } = req.body;

      if (!label || !address) {
         return res
            .status(400)
            .json({ success: false, message: "Дані відсутні" });
      }

      await pool.query(
         `INSERT INTO public.pharmacies (title, address) VALUES ($1, $2)`,
         [label, address]
      );

      res.json({ success: true, message: "Категорію додано" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const deletePharmacy = async (req, res) => {
   try {
      const { id } = req.params;

      if (!id) {
         return res
            .status(400)
            .json({ success: false, message: "ID категорії обов'язковий!" });
      }

      await pool.query(`DELETE FROM public.pharmacies WHERE pharmacy_id = $1`, [
         id,
      ]);

      res.json({ success: true, message: "Категорію видалено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const updatePharmacy = async (req, res) => {
   try {
      const { id } = req.params;
      const { newLabel, newAddress } = req.body;

      if (!newLabel || !newAddress) {
         return res
            .status(400)
            .json({ success: false, message: "Всі поля обов'язкові!" });
      }

      await pool.query(
         `UPDATE public.pharmacies SET title = $1, address = $2 WHERE pharmacy_id = $3`,
         [newLabel, newAddress, id]
      );

      res.json({ success: true, message: "Категорію оновлено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

module.exports = {
   getPharmacies,
   addPharmacy,
   deletePharmacy,
   updatePharmacy,
};
