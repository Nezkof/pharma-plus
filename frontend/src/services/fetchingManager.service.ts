const API_URL = import.meta.env.VITE_API_URL;

export default class FetchingService {
   static async fetchTextData(url: string) {
      try {
         const response = await fetch(`${API_URL}/${url}`);
         const data = await response.text();
         return data;
      } catch (error) {
         console.error("Error loading categories:", error);
         return "";
      }
   }

   static async fetchJSON(url: string) {
      try {
         const response = await fetch(`${API_URL}/${url}`);
         const data = await response.json();
         return data;
      } catch (error) {
         console.error("Error loading categories:", error);
         return "";
      }
   }

   static async fetchFilteredData(url: string, filterValue: string) {
      try {
         const response = await fetch(
            `${API_URL}/${url}?filter=${filterValue}`
         );
         const data = await response.text();
         return data;
      } catch (error) {
         console.error("Error loading categories:", error);
         return "";
      }
   }

   static async fetchOrderItem(url: string, cartData: any) {
      try {
         const response = await fetch(`${API_URL}/${url}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: cartData,
         });

         const data = await response.text();
         return data;
      } catch (error) {
         console.error("Помилка при відправці даних:", error);
         return "";
      }
   }
}
