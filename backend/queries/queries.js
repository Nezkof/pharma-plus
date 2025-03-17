function getCategoryProductsQuery({
   categoryId,
   applicationMethods,
   forms,
   input,
}) {
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

   if (input) {
      query += ` AND products.title ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${input}%`);
   }

   query += `
      GROUP BY products.title, products.description,
               application_methods.application_methods_label,
               forms.form_label;
   `;

   return { query, queryParams };
}

module.exports = { getCategoryProductsQuery };
