const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getOrders = async (req, res) => {
   try {
      const { rows } = await pool.query(`
            select order_items.order_item_id, orders.order_id, products.title, order_items.price, order_items.amount, orders.status
            from order_items
            inner join orders on orders.order_id = order_items.order_id
            inner join pharmacies_products on pharmacies_products.pharmacy_product_id = order_items.pharmacy_product_id 
            inner join products on pharmacies_products.product_id = products.product_id 
      
      `);
      res.render("admin/admin-orders.ejs", { orders: rows });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const deleteOrder = async (req, res) => {
   try {
      const { id } = req.params;

      if (!id) {
         return res
            .status(400)
            .json({ success: false, message: "ID обов'язковий!" });
      }

      await pool.query(
         `DELETE FROM public.order_items WHERE order_item_id = $1`,
         [id]
      );

      res.json({ success: true, message: "Елемент замовлення видалено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

const updateOrder = async (req, res) => {
   try {
      const { id } = req.params;
      const { newStatus } = req.body;

      if (!newStatus) {
         return res
            .status(400)
            .json({ success: false, message: "Всі поля обов'язкові!" });
      }

      await pool.query(
         `UPDATE public.orders SET status = $1 WHERE order_id = $2`,
         [newStatus, id]
      );

      res.json({ success: true, message: "Форму оновлено!" });
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Помилка бази даних" });
   }
};

module.exports = {
   getOrders,
   deleteOrder,
   updateOrder,
};
