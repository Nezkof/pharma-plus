const API_URL = import.meta.env.VITE_API_URL;

export default class FetchingService {
   static async fetchCookies(url: string) {
      try {
         const response = await fetch(`${API_URL}/${url}`, {
            method: "GET",
            credentials: "include",
         });

         if (!response.ok) {
            throw new Error("Failed to fetch client_id");
         }

         const data = await response.json();

         return data.client_id;
      } catch (error) {
         console.error("Error fetching client_id:", error);
         return null;
      }
   }

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
         console.error("Post data error:", error);
         return "";
      }
   }

   static async setUserData(url: string, data: any) {
      try {
         const response = await fetch(`${API_URL}/${url}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               address: data,
            }),
         });

         if (!response.ok) {
            console.error(
               "Post data error:",
               response.status,
               response.statusText
            );
            return null;
         }

         return await response.json();
      } catch (error) {
         console.error("Post data error:", error);
         return null;
      }
   }

   static async postOrder(url: string, orderData: any) {
      try {
         const response = await fetch(`${API_URL}/${url}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
         });

         const data = await response.json();
         return data;
      } catch (error) {
         console.error("Post data error:", error);
         return "";
      }
   }
}
