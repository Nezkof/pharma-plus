import { fetchPost, fetchDelete, fetchPut } from "./helpers.js";

function addProduct() {
   const selectors = {
      titleInput: "[data-js-label-input]",
      descriptionInput: "[data-js-description-input]",
      applicationMethodSelect: "[data-js-application-input]",
      formSelect: "[data-js-form-input]",
      categorySelect: "[data-js-category-input]",
      brandInput: "[data-js-brand-input]",
      imageInput: "[data-js-image-input]",
   };

   const title = document.querySelector(selectors.titleInput)?.value;
   const description = document.querySelector(
      selectors.descriptionInput
   )?.value;
   const applicationMethodId = document.querySelector(
      selectors.applicationMethodSelect
   )?.value;
   const formId = document.querySelector(selectors.formSelect)?.value;
   const categoryId = document.querySelector(selectors.categorySelect)?.value;
   const brand = document.querySelector(selectors.brandInput)?.value;
   const image = document.querySelector(selectors.imageInput)?.value;

   if (
      !title ||
      !description ||
      !applicationMethodId ||
      !formId ||
      !categoryId ||
      !brand ||
      !image
   ) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPost("admin/add-product", {
      title,
      description,
      application_method_id: applicationMethodId,
      form_id: formId,
      category_id: categoryId,
      brand,
      image,
   });
}

function deleteProduct(id) {
   console.log("test");

   if (confirm("Ви впевнені, що хочете видалити продукт?")) {
      fetchDelete("admin/delete-product", id);
   }
}

async function editProduct(id) {
   let response = await fetch("/admin/application-methods-json");
   const applicationMethods = await response.json();

   response = await fetch("/admin/forms-json");
   const forms = await response.json();

   response = await fetch("/admin/categories-json");
   const categories = await response.json();

   const labelTd = document.getElementById(`label-${id}`);
   const descriptionTd = document.getElementById(`description-${id}`);
   const applicationTd = document.getElementById(`application-${id}`);
   const formTd = document.getElementById(`form-${id}`);
   const categoryTd = document.getElementById(`category-${id}`);
   const brandTd = document.getElementById(`brand-${id}`);
   const imageTd = document.getElementById(`image-${id}`);
   const editBtn = document.getElementById(`edit-btn-${id}`);

   const currentLabel = labelTd.textContent.trim();
   const currentDescription = descriptionTd.textContent.trim();
   const currentApplication = applicationTd.textContent.trim();
   const currentForm = formTd.textContent.trim();
   const currentCategory = categoryTd.textContent.trim();
   const currentBrand = brandTd.textContent.trim();
   const currentImage = imageTd.textContent.trim();

   labelTd.innerHTML = `<input type="text" id="edit-label-${id}" value="${currentLabel}">`;
   descriptionTd.innerHTML = `<input type="text" id="edit-description-${id}" value="${currentDescription}">`;
   brandTd.innerHTML = `<input type="text" id="edit-brand-${id}" value="${currentBrand}">`;
   imageTd.innerHTML = `<input type="text" id="edit-image-${id}" value="${currentImage}">`;

   applicationTd.innerHTML = getDropdown(
      "application",
      id,
      applicationMethods,
      currentApplication
   );

   formTd.innerHTML = getDropdown("form", id, forms, currentForm);
   categoryTd.innerHTML = getDropdown(
      "category",
      id,
      categories,
      currentCategory
   );

   editBtn.textContent = "Зберегти";
   editBtn.setAttribute("onclick", `saveProduct(${id})`);
}

function getDropdown(type, id, options, currentValue) {
   let dropdown = `<select id="edit-${type}-${id}">`;

   options.forEach((option) => {
      let optionValue, optionLabel;

      switch (type) {
         case "application":
            optionValue = option.application_methods_id;
            optionLabel = option.application_methods_label;
            break;
         case "form":
            optionValue = option.form_id;
            optionLabel = option.form_label;
            break;
         case "category":
            optionValue = option.category_id;
            optionLabel = option.category_label;
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

function saveProduct(id) {
   const newLabel = document.getElementById(`edit-label-${id}`).value.trim();
   const newDescription = document
      .getElementById(`edit-description-${id}`)
      .value.trim();
   const newApplicationMethod = document.getElementById(
      `edit-application-${id}`
   ).value;
   const newForm = document.getElementById(`edit-form-${id}`).value;
   const newCategory = document.getElementById(`edit-category-${id}`).value;
   const newBrand = document.getElementById(`edit-brand-${id}`).value.trim();
   const newImage = document.getElementById(`edit-image-${id}`).value.trim();

   if (
      !newLabel ||
      !newDescription ||
      !newApplicationMethod ||
      !newForm ||
      !newCategory ||
      !newBrand ||
      !newImage
   ) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPut("admin/update-product", id, {
      newLabel,
      newDescription,
      newApplicationMethod,
      newForm,
      newCategory,
      newBrand,
      newImage,
   });
}

window.addProduct = addProduct;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.saveProduct = saveProduct;
