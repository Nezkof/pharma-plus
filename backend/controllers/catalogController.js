const {
   applicationMethodLabelQuery,
   formLabelQuery,
   getCategoryProductsQuery,
} = require("../queries/queries");

const { Pool } = require("pg");
const pool = new Pool({
   user: process.env.USER,
   host: process.env.HOST,
   database: process.env.DATABASE,
   password: process.env.PASSWORD,
   port: process.env.PORT,
});

const getFilters = async (req, res) => {
   try {
      const filterTypes = {};
      const filterTypesLables = ["Application methods", "Forms"];
      const queries = [applicationMethodLabelQuery, formLabelQuery];

      const reqResult = await Promise.all(
         queries.map((query) =>
            pool
               .query(query)
               .then((result) =>
                  result.rows.map((row) => Object.values(row)[0])
               )
         )
      );

      for (let i = 0; i < filterTypesLables.length; i++) {
         filterTypes[filterTypesLables[i]] = {
            filterTypeLable: filterTypesLables[i],
            filterTypeId: i,
            filters: reqResult[i],
         };
      }

      res.render("filters-panel", { filterTypes });
   } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
   }
};

async function getCategoryProducts(categoryId, filters) {
   const selectedFilters = filters ? filters.split("/") : [];
   let applicationMethods = [];
   let forms = [];
   let input = "";

   selectedFilters.forEach((filter) => {
      const [key, ...valueParts] = filter.split("=");
      const value = valueParts.join("=");

      if (key === "filter-0")
         applicationMethods.push(decodeURIComponent(value));
      if (key === "filter-1") forms.push(decodeURIComponent(value));
      if (key === "input") input = decodeURIComponent(value);
   });

   const { query, queryParams } = getCategoryProductsQuery({
      categoryId,
      applicationMethods,
      forms,
      input,
   });

   try {
      const { rows } = await pool.query(query, queryParams);
      return rows;
   } catch (error) {
      console.error("Query error:", error);
      throw error;
   }
}

module.exports = {
   getFilters,
   getCategoryProducts,
};
