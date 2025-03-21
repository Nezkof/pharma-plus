const { citiesListQuery } = require("../queries/queries");

const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const renderCitiesList = async (req, res) => {
   try {
      const filter = req.query.filter;

      const { rows } = await pool.query(citiesListQuery, [`%${filter}%`]);

      res.render("citiesList", { rows });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

module.exports = {
   renderCitiesList,
};
