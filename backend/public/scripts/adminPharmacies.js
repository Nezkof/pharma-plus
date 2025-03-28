import { fetchPost, fetchDelete, fetchPut } from "./helpers.js";

function addPharmacy() {
   const seletectors = {
      labelInput: "[data-js-label-input]",
      addressInput: "[data-js-address-input]",
   };

   const label = document.querySelector(seletectors.labelInput)?.value;
   const address = document.querySelector(seletectors.addressInput)?.value;

   if (!label || !address) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPost("admin/add-pharmacy", { label, address });
}

function deletePharmacy(id) {
   if (confirm("Ви впевнені, що хочете видалити категорію?")) {
      fetchDelete("admin/delete-pharmacy", id);
   }
}

function editPharmacy(id) {
   const labelTd = document.getElementById(`label-${id}`);
   const addressTd = document.getElementById(`address-${id}`);
   const editBtn = document.getElementById(`edit-btn-${id}`);

   const currentLabel = labelTd.textContent.trim();
   const currentAddress = addressTd.textContent.trim();

   labelTd.innerHTML = `<input type="text" id="edit-label-${id}" value="${currentLabel}">`;
   addressTd.innerHTML = `<input type="text" id="edit-address-${id}" value="${currentAddress}">`;

   editBtn.textContent = "Зберегти";
   editBtn.setAttribute("onclick", `savePharmacy(${id})`);
}

function savePharmacy(id) {
   const newLabel = document.getElementById(`edit-label-${id}`).value.trim();
   const newAddress = document
      .getElementById(`edit-address-${id}`)
      .value.trim();

   if (!newLabel || !newAddress) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPut("admin/update-pharmacy", id, { newLabel, newAddress });
}

window.addPharmacy = addPharmacy;
window.deletePharmacy = deletePharmacy;
window.editPharmacy = editPharmacy;
window.savePharmacy = savePharmacy;
