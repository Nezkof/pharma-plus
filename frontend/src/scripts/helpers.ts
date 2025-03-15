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

export function debounce<T extends (...args: any[]) => void>(
   func: T,
   timeout: number = 300
): (...args: Parameters<T>) => void {
   let timer: ReturnType<typeof setTimeout>;
   return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
         func(...args);
      }, timeout);
   };
}
