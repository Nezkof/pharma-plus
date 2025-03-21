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

      res.render("order-to-confirm-item", { data });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

module.exports = {
   renderOrderItem,
   renderItemsToConfirm,
};
