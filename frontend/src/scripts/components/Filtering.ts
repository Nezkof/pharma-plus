import FetchingService from "../../services/fetchingManager.service.ts";
import DOMParserService from "../../services/DOMParser.service.ts";
import { safeFieldInit } from "../helpers.ts";
import { debounce } from "../helpers.ts";

const rootSelector = "[data-js-products-page]";

class Filtering {
   private categoryId: string | null;
   private rootElement: HTMLElement;
   private searcherElement: HTMLElement;
   private searcherInputElement: HTMLInputElement;
   private filterListElement!: HTMLElement;
   private filterListButtonElement!: HTMLButtonElement;
   private productsListElement!: HTMLElement;

   selectors = {
      root: rootSelector,
      searcher: "[data-js-products-searcher]",
      searcherInput: "[data-js-searcher-input]",
      filterList: "[data-js-filter-list]",
      filterListButton: "[data-js-filter-list-button]",
      filterCheckbox: "[data-js-filter-checkbox]",
      productList: "[data-js-product-catalog]",
      productButton: "[data-js-product-button]",
   };

   stateClasses = {
      isExpanded: "is-expanded",
      isClosed: "is-closed",
   };

   constructor(rootElement: HTMLElement) {
      this.categoryId = localStorage.getItem("selectedCategoryId");
      this.rootElement = rootElement;
      this.searcherElement = safeFieldInit(
         this.rootElement,
         this.selectors.searcher
      );
      this.searcherInputElement = safeFieldInit(
         this.rootElement,
         this.selectors.searcherInput
      );

      this.filterListButtonElement = safeFieldInit(
         this.rootElement,
         this.selectors.filterListButton
      );

      FetchingService.fetchTextData(`catalog`).then((data) => {
         const listElement = DOMParserService.toDOM(
            data,
            this.selectors.filterList
         );
         if (listElement) this.searcherElement.appendChild(listElement);

         this.filterListElement = safeFieldInit(
            this.rootElement,
            this.selectors.filterList
         );
         this.bindEvents();
      });

      FetchingService.fetchTextData(`catalog/${this.categoryId}`).then(
         (data) => {
            const catalogElement = DOMParserService.toDOM(
               data,
               this.selectors.productList
            );
            if (catalogElement) this.rootElement.appendChild(catalogElement);
            this.productsListInit();
         }
      );
   }

   productsListInit() {
      this.productsListElement = safeFieldInit(
         this.rootElement,
         this.selectors.productList
      );
   }

   getSelectedFilters = () => {
      const filterValues: { [key: string]: string[] } = {};

      this.filterListElement
         .querySelectorAll<HTMLInputElement>(
            `${this.selectors.filterCheckbox}:checked`
         )
         .forEach((checkbox) => {
            const key = checkbox.name;
            (filterValues[key] ??= []).push(checkbox.value);
         });

      return filterValues;
   };

   formQueryString() {
      const filterValues = this.getSelectedFilters();
      const queryStringParts = [];

      const inputValue = this.searcherInputElement.value.trim();
      if (inputValue) {
         queryStringParts.push(`input=${encodeURIComponent(inputValue)}`);
      }

      const filterParams = Object.entries(filterValues).map(
         ([key, values]) =>
            `${encodeURIComponent(key)}=${values
               .map(encodeURIComponent)
               .join(",")}`
      );

      if (filterParams.length) {
         queryStringParts.unshift(filterParams.join("/"));
      }

      return queryStringParts.length
         ? `?filters=${queryStringParts.join("/")}`
         : "";
   }

   handleListButtonClick = () => {
      this.filterListButtonElement.classList.toggle(
         this.stateClasses.isExpanded
      );
      this.filterListElement.classList.toggle(this.stateClasses.isExpanded);
   };

   handleCheckboxClick = () => {
      const queryString = this.formQueryString();

      try {
         FetchingService.fetchTextData(
            `catalog/${this.categoryId}${queryString}`
         ).then((data) => {
            const catalogElement = DOMParserService.toDOM(
               data,
               this.selectors.productList
            );

            if (!catalogElement) return;

            this.rootElement.replaceChild(
               catalogElement,
               this.productsListElement
            );

            this.productsListInit();
         });
      } catch (error) {
         console.error("Error:", error);
      }
   };

   onInputChange = debounce(async () => {
      const queryString = this.formQueryString();

      FetchingService.fetchTextData(
         `catalog/${this.categoryId}${queryString}`
      ).then((data) => {
         const catalogElement = DOMParserService.toDOM(
            data,
            this.selectors.productList
         );

         if (!catalogElement) return;

         this.rootElement.replaceChild(
            catalogElement,
            this.productsListElement
         );

         this.productsListInit();
      });
   }, 500);

   handleProductButtonClick(button: HTMLElement) {
      localStorage.setItem(
         "selectedProductId",
         button.getAttribute("id") || ""
      );
   }

   onMouseClick = (event: any) => {
      const target = event.target;

      if (target.closest(this.selectors.filterListButton))
         this.handleListButtonClick();

      if (target.closest(this.selectors.filterCheckbox)) {
         debounce(async () => {
            this.handleCheckboxClick();
         }, 1000)();
      }

      if (target.closest(this.selectors.productButton)) {
         this.handleProductButtonClick(
            target.closest(this.selectors.productButton)
         );
      }
   };

   bindEvents() {
      this.searcherInputElement.addEventListener("input", this.onInputChange);
      this.rootElement.addEventListener("click", this.onMouseClick);
   }
}

class FilteringCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new Filtering(element);
         }
      });
   }
}

export default FilteringCollection;
