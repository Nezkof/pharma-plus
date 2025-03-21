//citiesListController
const citiesListQuery = `
   select * from cities where cities.name ilike $1;
`;

//catalogController
function getCategoryProductsQuery({
   categoryId,
   applicationMethods,
   forms,
   input,
}) {
   let query = `
      SELECT products.product_id, products.title, products.description,
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

   if (input) {
      query += ` AND products.title ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${input}%`);
   }

   query += `
      GROUP BY products.product_id, products.title, products.description,
               application_methods.application_methods_label,
               forms.form_label;
   `;

   return { query, queryParams };
}

const applicationMethodLabelQuery = `
   SELECT application_methods_label
   FROM public.application_methods;
`;

const formLabelQuery = `
   SELECT form_label
   FROM public.forms;
`;

//categoriesController
const filteredCategoriesQuery = `
   SELECT *
   FROM categories
   WHERE categories.category_label ILIKE $1
`;

//productController
const productCardDataQuery = `
   select products.title, products.description, products.image 
   from products
   where products.product_id = $1
`;

const productQuery = `        
SELECT 
   products.title, 
   products.brand, 
   products.description, 
   categories.category_label
FROM products
INNER JOIN categories ON products.category_id = categories.category_id
WHERE products.product_id = $1`;

const pharmacyQuery = `
         SELECT 
            pharmacies.pharmacy_id,
            pharmacies.title AS pharmacy_name, 
            pharmacies.address, 
            pharmacies_products.price
         FROM pharmacies_products
         INNER JOIN pharmacies ON pharmacies.pharmacy_id = pharmacies_products.pharmacy_id
         WHERE pharmacies_products.product_id = $1
         AND (pharmacies.title ILIKE $2 OR pharmacies.address ILIKE $2)
`;

const pharmacyProductQuery = `
   select pharmacies_products.pharmacy_product_id, pharmacies.title as pharmacy_name, pharmacies.address, products.image, products.title, products.description, products.category_id, pharmacies_products.price
   from products
   inner join pharmacies_products on pharmacies_products.product_id = products.product_id
   inner join pharmacies on pharmacies_products.pharmacy_id = pharmacies.pharmacy_id  
   where products.product_id = $1 and pharmacies.pharmacy_id = $2
`;

module.exports = {
   getCategoryProductsQuery,
   applicationMethodLabelQuery,
   formLabelQuery,
   filteredCategoriesQuery,
   productCardDataQuery,
   productQuery,
   pharmacyQuery,
   pharmacyProductQuery,
   citiesListQuery,
};
