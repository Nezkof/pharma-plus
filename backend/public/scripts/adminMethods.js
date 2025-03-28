import { fetchPost, fetchDelete, fetchPut } from "./helpers.js";

function addMethod() {
   const seletectors = {
      labelInput: "[data-js-label-input]",
   };

   const label = document.querySelector(seletectors.labelInput)?.value;

   if (!label) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPost("admin/add-application-method", { label });
}

function deleteMethod(id) {
   if (confirm("Ви впевнені, що хочете видалити категорію?")) {
      fetchDelete("admin/delete-application-method", id);
   }
}

function editMethod(id) {
   const labelTd = document.getElementById(`label-${id}`);
   const editBtn = document.getElementById(`edit-btn-${id}`);

   const currentLabel = labelTd.textContent.trim();

   labelTd.innerHTML = `<input type="text" id="edit-label-${id}" value="${currentLabel}">`;

   editBtn.textContent = "Зберегти";
   editBtn.setAttribute("onclick", `saveMethod(${id})`);
}

function saveMethod(id) {
   const newLabel = document.getElementById(`edit-label-${id}`).value.trim();

   if (!newLabel) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPut("admin/update-application-method", id, { newLabel });
}

window.addMethod = addMethod;
window.deleteMethod = deleteMethod;
window.editMethod = editMethod;
window.saveMethod = saveMethod;
