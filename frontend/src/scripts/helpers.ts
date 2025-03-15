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
