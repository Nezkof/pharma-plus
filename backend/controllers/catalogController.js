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
      const queries = [
         `
            SELECT application_methods_label
            FROM public.application_methods;
         `,
         `
            SELECT form_label
            FROM public.forms;
         `,
      ];

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
   console.log("filters:", filters);

   const selectedFilters = filters ? filters.split("/") : [];
   let applicationMethods = [];
   let forms = [];

   selectedFilters.forEach((filter) => {
      if (filter.startsWith("filter-0=")) {
         applicationMethods.push(filter.split("=")[1]);
      }
      if (filter.startsWith("filter-1=")) {
         forms.push(filter.split("=")[1]);
      }
   });

   let query = `
     SELECT products.title, products.description,
            application_methods.application_methods_label,
            forms.form_label,
            MIN(pharmacies_products.price) AS min_price
     FROM products
     INNER JOIN products_application_methods ON products_application_methods.product_id = products.product_id
     INNER JOIN application_methods ON application_methods.application_methods_id = products_application_methods.application_methods_id
     INNER JOIN products_forms ON products_forms.product_id = products.product_id
     INNER JOIN forms ON forms.form_id = products_forms.form_id
     INNER JOIN pharmacies_products ON pharmacies_products.product_id = products.product_id
     WHERE products.category_id = $1
   `;

   const queryParams = [categoryId];

   if (applicationMethods.length > 0) {
      query += ` AND application_methods.application_methods_label IN (${applicationMethods
         .map((_, index) => `$${queryParams.length + index + 1}`)
         .join(", ")})`;
      queryParams.push(...applicationMethods);
   }

   if (forms.length > 0) {
      query += ` AND forms.form_label IN (${forms
         .map((_, index) => `$${queryParams.length + index + 1}`)
         .join(", ")})`;
      queryParams.push(...forms);
   }

   query += `
     GROUP BY products.title, products.description,
              application_methods.application_methods_label,
              forms.form_label;
   `;

   try {
      const { rows } = await pool.query(query, queryParams);
      return rows;
   } catch (error) {
      console.error("Помилка виконання запиту:", error);
      throw error;
   }
}

// const getCategoryProducts = async (req, res) => {
//    try {
//       const { categoryId } = req.params;
//       const filter = req.query.filter || "";
//       const query = `
//          SELECT
//             products.product_id,
//             products.title,
//             products.description,
//             products.category_id,
//             products.image,
//             MIN(pharmacies_products.price) AS min_price
//          FROM products
//          INNER JOIN pharmacies_products ON products.product_id = pharmacies_products.product_id
//          WHERE products.category_id = $1
//          AND products.title ILIKE $2
//          GROUP BY products.product_id, products.title, products.category_id, products.image;
//       `;

//       const { rows } = await pool.query(query, [categoryId, `%${filter}%`]);
//       res.render("product-catalog", { products: rows });
//    } catch (error) {
//       console.error(error);
//       res.status(500).send("Database error");
//    }
// };

// const getCategoryProducts = async (req, res) => {
//    try {
//       const { categoryId } = req.params;
//       const filter = req.query.filter || "";

//       const query = `
//          SELECT
//             products.product_id,
//             products.title,
//             products.description,
//             products.category_id,
//             products.image,
//             MIN(pharmacies_products.price) AS min_price
//          FROM products
//          INNER JOIN pharmacies_products ON products.product_id = pharmacies_products.product_id
//          WHERE products.category_id = $1
//          AND (products.title ILIKE $2 OR products.description ILIKE $2)  -- Filter by filterValue
//          GROUP BY products.product_id, products.title, products.category_id, products.image;
//       `;

//       const { rows } = await pool.query(query, [categoryId, [`%${filter}%`]]);

//       res.render("product-catalog", { products: rows });
//    } catch (error) {
//       console.error(error);
//       res.status(500).send("Database error");
//    }
// };

module.exports = {
   getFilters,
   getCategoryProducts,
};
