import { fetchPost, fetchDelete, fetchPut } from "./helpers.js";

function addForm() {
   const seletectors = {
      labelInput: "[data-js-label-input]",
   };

   const label = document.querySelector(seletectors.labelInput)?.value;

   if (!label) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPost("admin/add-form", { label });
}

function deleteForm(id) {
   if (confirm("Ви впевнені, що хочете видалити форму?")) {
      fetchDelete("admin/delete-form", id);
   }
}

function editForm(id) {
   const labelTd = document.getElementById(`label-${id}`);
   const editBtn = document.getElementById(`edit-btn-${id}`);

   const currentLabel = labelTd.textContent.trim();

   labelTd.innerHTML = `<input type="text" id="edit-label-${id}" value="${currentLabel}">`;

   editBtn.textContent = "Зберегти";
   editBtn.setAttribute("onclick", `saveForm(${id})`);
}

function saveForm(id) {
   const newLabel = document.getElementById(`edit-label-${id}`).value.trim();

   if (!newLabel) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPut("admin/update-form", id, { newLabel });
}

window.addForm = addForm;
window.deleteForm = deleteForm;
window.editForm = editForm;
window.saveForm = saveForm;
