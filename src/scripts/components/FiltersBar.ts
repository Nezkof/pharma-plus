import { safeFieldInit } from "./../helpers.ts";

const rootSelector = "[data-js-products-page]";

interface State {
   selectedFilters: Set<string>;
}

class FiltersBar {
   private rootElement: HTMLElement;
   private filtersBarElement: HTMLElement;
   // private filterElements: NodeListOf<HTMLElement>;

   selectors = {
      root: rootSelector,
      filterItem: "[data-js-filter-item]",
      filterCheckbox: "[data-js-filter-checkbox]",
      filtersBar: "[data-js-filters-bar]",
   };

   attributes = {
      filterValue: "data-filter-value",
   };

   classes = {
      filtersBarItem: "filters-bar__item",
      filterBarTitle: "filters-bar__title",
   };

   state: State = {
      selectedFilters: new Set<string>(),
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;

      this.filtersBarElement = safeFieldInit(
         rootElement,
         this.selectors.filtersBar
      );

      // this.filterElements = this.rootElement.querySelectorAll(
      //    this.selectors.filter
      // );

      this.bindEvents();
   }

   updateUI() {
      const createFilterItem = (filterText: string) => {
         const li = document.createElement("li");
         li.classList.add(this.classes.filtersBarItem);

         const span = document.createElement("span");
         span.classList.add(this.classes.filterBarTitle);
         span.textContent = filterText;

         li.appendChild(span);

         return li;
      };

      const currentFilters = Array.from(this.filtersBarElement.children).map(
         (el) => el.textContent?.trim()
      );

      const newFilters = Array.from(this.state.selectedFilters);

      if (JSON.stringify(currentFilters) === JSON.stringify(newFilters)) return;

      const fragment = document.createDocumentFragment();
      newFilters.forEach((element) => {
         const newFilter = createFilterItem(element);
         fragment.appendChild(newFilter);
      });

      this.filtersBarElement.replaceChildren(fragment);
   }

   onMouseClick = (event: any) => {
      const filterItem = (event.target as HTMLElement).closest(
         this.selectors.filterItem
      );

      if (!filterItem) return;

      const checkbox = filterItem.querySelector<HTMLInputElement>(
         this.selectors.filterCheckbox
      );
      const filterValue = filterItem.getAttribute(this.attributes.filterValue);

      if (checkbox && filterValue) {
         if (checkbox.checked) {
            this.state.selectedFilters.add(filterValue);
         } else {
            this.state.selectedFilters.delete(filterValue);
         }
      }

      this.updateUI();
   };

   bindEvents() {
      this.rootElement.addEventListener("click", this.onMouseClick);
   }
}

class FiltersBarCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new FiltersBar(element);
         }
      });
   }
}

export default FiltersBarCollection;
