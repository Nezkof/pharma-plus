export function safeFieldInit<T extends HTMLElement>(
   rootElement: HTMLElement,
   selector: string
): T {
   const fieldToCheck = rootElement.querySelector<T>(selector);

   if (fieldToCheck) {
      return fieldToCheck;
   } else {
      throw new TypeError(`Element not found for selector: ${selector}`);
   }
}

export async function getFilteredOptions(
   url: string,
   options: RequestInit = {}
) {
   //TODO CONNECT DB
   console.log("fetching");
   try {
      const response = await fetch(`http://localhost:8000${url}`, options);
      if (!response.ok)
         throw new Error(`Fetching error: ${response.statusText}`);
      return await response.json();
   } catch (error: any) {
      console.error(error.message);
   }
}
