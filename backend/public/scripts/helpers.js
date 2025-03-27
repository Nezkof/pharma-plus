export function fetchPost(url, data) {
   fetch(`http://localhost:8000/${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         category_label: data.label,
         category_image: data.image,
      }),
   })
      .then((response) => response.json())
      .then((data) => {
         if (data.success) location.reload();
         else alert("Помилка при додаванні");
      });
}

export function fetchDelete(url, id) {
   fetch(`http://localhost:8000/${url}/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
         if (data.success) location.reload();
         else alert("Помилка при видаленні");
      });
}

export function fetchPut(url, id, data) {
   fetch(`http://localhost:8000/${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: data.newLabel, image: data.newImage }),
   })
      .then((response) => response.json())
      .then((data) => {
         if (data.success) location.reload();
         else alert("Помилка при оновленні");
      })
      .catch((error) => console.error("Fetch error:", error));
}
