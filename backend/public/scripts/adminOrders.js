import { fetchPost, fetchDelete, fetchPut } from "./helpers.js";

function deleteOrderItem(id) {
   if (confirm("Ви впевнені, що хочете видалити елемент замовлення?")) {
      fetchDelete("admin/delete-order-item", id);
   }
}

function editOrderItem(orderId, orderItemId) {
   const labelTd = document.getElementById(`status-${orderItemId}`);
   const editBtn = document.getElementById(`edit-btn-${orderItemId}`);

   const currentLabel = labelTd.textContent.trim();

   labelTd.innerHTML = `
   <select id="edit-status-${orderItemId}">
      <option value="Pending" ${
         currentLabel === "Pending" ? "selected" : ""
      }>Pending</option>
      <option value="Processing" ${
         currentLabel === "Processing" ? "selected" : ""
      }>Processing</option>
      <option value="Finished" ${
         currentLabel === "Finished" ? "selected" : ""
      }>Finished</option>
   </select>
`;

   editBtn.textContent = "Зберегти";
   editBtn.setAttribute("onclick", `saveOrderItem(${orderId},${orderItemId})`);
}

function saveOrderItem(orderId, orderItemId) {
   console.log("orderId:", orderId);
   console.log("orderItemId", orderItemId);

   const newStatus = document
      .getElementById(`edit-status-${orderItemId}`)
      .value.trim();

   if (!newStatus) {
      alert("Будь ласка, заповніть усі поля.");
      return;
   }

   fetchPut("admin/update-order-item", orderId, { newStatus });
}

window.deleteOrderItem = deleteOrderItem;
window.editOrderItem = editOrderItem;
window.saveOrderItem = saveOrderItem;
