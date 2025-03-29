import { fetchPost, fetchDelete, fetchPut } from "./helpers.js";

function addPharmacyProduct() {
   const selectors = {
      titleSelect: "[data-js-label-input]",
      priceInput: "[data-js-price-input]",
      pharmacySelect: "[data-js-pharmacy-input]",
   };

   const titleId = document.querySelector(selectors.titleSelect)?.value;
   const price = document.querySelector(selectors.priceInput)?.value;
   const pharmacyId = document.querySelector(selectors.pharmacySelect)?.value;

   if (!titleId || !price || !pharmacyId) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPost("admin/add-pharmacy-product", {
      product_id: titleId,
      price,
      pharmacy_id: pharmacyId,
   });
}

function deletePharmacyProduct(id) {
   if (confirm("Ви впевнені, що хочете видалити продукт?")) {
      fetchDelete("admin/delete-pharmacy-product", id);
   }
}

function editPharmacyProduct(id) {
   const labelTd = document.getElementById(`label-${id}`);
   const pharmacyTd = document.getElementById(`pharmacy-${id}`);
   const priceTd = document.getElementById(`price-${id}`);
   const editBtn = document.getElementById(`edit-btn-${id}`);

   const currentLabel = labelTd.textContent.trim();
   const currentPharamacy = pharmacyTd.textContent.trim();
   const currentPrice = priceTd.textContent.trim();

   priceTd.innerHTML = `<input type="text" id="edit-price-${id}" value="${currentPrice}">`;

   pharmacyTd.innerHTML = getDropdown(
      "pharmacies",
      id,
      pharmacies,
      currentPharamacy
   );

   labelTd.innerHTML = getDropdown("products", id, products, currentLabel);

   editBtn.textContent = "Зберегти";
   editBtn.setAttribute("onclick", `savePharmacyProduct(${id})`);
}

function getDropdown(type, id, options, currentValue) {
   let dropdown = `<select id="edit-${type}-${id}">`;

   console.log("options:", options);

   options.forEach((option) => {
      let optionValue, optionLabel;

      switch (type) {
         case "pharmacies":
            optionValue = option.pharmacy_id;
            optionLabel = option.title;
            break;
         case "products":
            optionValue = option.product_id;
            optionLabel = option.title;
            break;
         default:
            return;
      }

      const selected = optionLabel === currentValue ? "selected" : "";
      dropdown += `<option value="${optionValue}" ${selected}>${optionLabel}</option>`;
   });

   dropdown += "</select>";
   return dropdown;
}

function savePharmacyProduct(id) {
   const newLabel = document.getElementById(`edit-price-${id}`).value.trim();
   const newPharmacy = document
      .getElementById(`edit-pharmacies-${id}`)
      .value.trim();
   const newProduct = document.getElementById(`edit-products-${id}`).value;

   if (!newLabel || !newPharmacy || !newProduct) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPut("admin/update-pharmacy-product", id, {
      newLabel,
      newPharmacy,
      newProduct,
   });
}

window.addPharmacyProduct = addPharmacyProduct;
window.deletePharmacyProduct = deletePharmacyProduct;
window.editPharmacyProduct = editPharmacyProduct;
window.savePharmacyProduct = savePharmacyProduct;
