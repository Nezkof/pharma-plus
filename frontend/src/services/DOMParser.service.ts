export default class DOMParserService {
   static toDOM(data: string, selector: string) {
      try {
         const parser = new DOMParser();
         const doc = parser.parseFromString(data, "text/html");
         const catalogElement = doc.querySelector(selector);
         return catalogElement;
      } catch (error) {
         console.error("Error:", error);
         return null;
      }
   }
}
