import { fetchPost, fetchDelete, fetchPut } from "./helpers.js";

function addCategory() {
   const seletectors = {
      labelInput: "[data-js-label-input]",
      imageInput: "[data-js-image-input]",
   };

   const label = document.querySelector(seletectors.labelInput)?.value;
   const image = document.querySelector(seletectors.imageInput)?.value;

   if (!label || !image) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPost("admin/add-category", { label, image });
}

function deleteCategory(id) {
   if (confirm("Ви впевнені, що хочете видалити категорію?")) {
      fetchDelete("admin/delete-category", id);
   }
}

export function editCategory(categoryId) {
   const labelTd = document.getElementById(`label-${categoryId}`);
   const imageTd = document.getElementById(`image-${categoryId}`);
   const editBtn = document.getElementById(`edit-btn-${categoryId}`);

   const currentLabel = labelTd.textContent.trim();
   const currentImage = imageTd.textContent.trim();

   labelTd.innerHTML = `<input type="text" id="edit-label-${categoryId}" value="${currentLabel}">`;
   imageTd.innerHTML = `<input type="text" id="edit-image-${categoryId}" value="${currentImage}">`;

   editBtn.textContent = "Зберегти";
   editBtn.setAttribute("onclick", `saveCategory(${categoryId})`);
}

export function saveCategory(categoryId) {
   const newLabel = document
      .getElementById(`edit-label-${categoryId}`)
      .value.trim();
   const newImage = document
      .getElementById(`edit-image-${categoryId}`)
      .value.trim();

   if (!newLabel || !newImage) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPut("admin/update-category", categoryId, { newLabel, newImage });
}

window.addCategory = addCategory;
window.deleteCategory = deleteCategory;
window.editCategory = editCategory;
window.saveCategory = saveCategory;
