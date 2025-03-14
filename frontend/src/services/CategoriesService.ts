const API_URL = import.meta.env.API_URL;

export default class CategoriesService {
   static async getCategories() {
      try {
         const response = await fetch(`http://localhost:8000/categories`);
         if (!response.ok) {
            throw new Error("Failed to fetch categories");
         }
         return await response.json();
      } catch (error) {
         console.error("Error fetching categories:", error);
         return [];
      }
   }
}
