const { addUser } = require("../queries/queries.js");

const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const setUserData = async (req, res) => {
   try {
      const { given_name, family_name, email } = req.user._json;
      const values = [given_name, family_name, email];

      const { rows } = await pool.query(addUser, values);

      if (rows.length > 0) {
         const clientId = rows[0].client_id;
         console.log("User added/updated with client_id:", clientId);

         return clientId;
      }

      console.log("No user data returned.");
      return null;
   } catch (error) {
      console.error("Error adding/updating user:", error);
      return null;
   }
};

const getCookie = async (req, res) => {
   const clientId = req.cookies?.client_id;

   console.log("res cookie", clientId);

   if (!clientId) {
      return res.status(401).json({ message: "No client_id found" });
   }

   res.json({ client_id: clientId });
};

module.exports = {
   setUserData,
   getCookie,
};
