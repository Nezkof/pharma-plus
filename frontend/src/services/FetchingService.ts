const API_URL = import.meta.env.VITE_API_URL;

export default class FetchingService {
   static async fetchData(url: string) {
      try {
         const response = await fetch(`${API_URL}/${url}`);
         const data = await response.text();
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
}
