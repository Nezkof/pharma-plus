const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const renderOrderItem = async (req, res) => {
   try {
      const data = req.body;

      res.render("order-item", { data });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const renderItemsToConfirm = async (req, res) => {
   try {
      const data = req.body;
      console.log(data);

      res.render("order-to-confirm-item", { data });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const postOrder = async (req, res) => {
   const client = await pool.connect();
   try {
      const data = req.body;
      const status = "Pending";
      let totalPrice = 0;
      let { userId } = data[0];
      if (userId < 0) userId = null;

      data.forEach((item) => {
         totalPrice += item.itemPrice * item.quantity;
      });

      const result = await client.query(
         `INSERT INTO orders (client_id, status, price)
         VALUES ($1, $2, $3)
         RETURNING order_id`,
         [userId, status, totalPrice]
      );

      const orderId = result.rows[0].order_id;

      data.forEach(async (item) => {
         console.log(item);
         const { pharmacyProductId, itemPrice, quantity } = item;
         const price = itemPrice * quantity;

         await client.query(
            `INSERT INTO order_items (order_id, amount, price, pharmacy_product_id)
                      VALUES ($1, $2, $3, $4)`,
            [orderId, quantity, price, pharmacyProductId]
         );
      });

      res.status(200).json({ message: "Order received successfully", data });
      await client.query("COMMIT");
   } catch (error) {
      console.error(error);
      await client.query("ROLLBACK");
      res.status(500).send("Database error");
   } finally {
      client.release();
   }
};

module.exports = {
   renderOrderItem,
   renderItemsToConfirm,
   postOrder,
};
