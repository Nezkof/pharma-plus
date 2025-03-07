import { safeFieldInit } from "./../helpers.ts";

const rootSelector = "[data-js-products-page]";

class FilteringMenu {
   private rootElement: HTMLElement;
   private filterListElement: HTMLElement;
   private filterListButtonElement: HTMLButtonElement;

   selectors = {
      root: rootSelector,
      filterList: "[data-js-filter-list]",
      filterListButton: "[data-js-filter-list-button]",
   };

   stateClasses = {
      isExpanded: "is-expanded",
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;
      this.filterListElement = safeFieldInit(
         this.rootElement,
         this.selectors.filterList
      );
      this.filterListButtonElement = safeFieldInit(
         this.rootElement,
         this.selectors.filterListButton
      );

      this.bindEvents();
   }

   handleListButtonClick = () => {
      this.filterListButtonElement.classList.toggle(
         this.stateClasses.isExpanded
      );
      this.filterListElement.classList.toggle(this.stateClasses.isExpanded);
   };

   onMouseClick = () => {
      this.handleListButtonClick();
   };

   bindEvents() {
      this.filterListButtonElement.addEventListener("click", this.onMouseClick);
   }
}

class FilteringMenuCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new FilteringMenu(element);
         }
      });
   }
}

export default FilteringMenuCollection;
