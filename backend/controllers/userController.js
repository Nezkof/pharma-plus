const {
   getUserDataQuery,
   updateUserAddress,
} = require("../queries/queries.js");

const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const setUserAddress = async (req, res) => {
   try {
      const { id } = req.params;
      const { address } = req.body;

      console.log(req.params);
      console.log(req.body);

      if (!id || !address) {
         return res.status(400).json({ error: "Missing id or address" });
      }

      const values = [address, id];

      const result = await pool.query(updateUserAddress, values);

      if (result.rowCount === 0) {
         return res.status(404).json({ error: "Client not found" });
      }

      res.status(200).json({
         message: "Address updated successfully",
         client: result.rows[0],
      });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

const getUserData = async (req, res) => {
   try {
      const { id } = req.params;

      if (!id) {
         return res.status(400).json({ error: "Missing id" });
      }

      const values = [id];

      const result = await pool.query(getUserDataQuery, values);

      if (result.rowCount === 0) {
         return res.status(404).json({ error: "Client not found" });
      }

      res.status(200).json({
         data: result.rows[0],
      });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

module.exports = {
   setUserAddress,
   getUserData,
};
