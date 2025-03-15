import { safeFieldInit } from "../helpers";
import FetchingService from "../../services/FetchingService";

const rootSelector = "[data-js-categories-section]";

interface State {
   activeCategoryIndex: number;
   categories: string[];
}

class CategoriesList {
   private rootElement: HTMLElement;
   private inputElement!: HTMLInputElement;
   private searchButtonElement!: HTMLButtonElement;
   private categoriesListElement: HTMLElement;

   selectors = {
      root: rootSelector,
      input: "[data-js-categories-input]",
      searchButton: "[data-js-categories-search-button]",
      categoriesList: "[data-js-categories-list]",
      categoryCardButton: "[data-js-category-card-button]",
   };

   stateClasses = {
      isActive: "is-active",
   };

   state: State = {
      activeCategoryIndex: 0,
      categories: [],
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;
      this.categoriesListElement = safeFieldInit(
         rootElement,
         this.selectors.categoriesList
      );

      FetchingService.fetchData("categories").then((data) => {
         this.categoriesListElement.innerHTML += data;
         this.init();
         this.bindEvents();
      });
   }

   init() {
      this.inputElement = safeFieldInit(this.rootElement, this.selectors.input);
      this.searchButtonElement = safeFieldInit(
         this.rootElement,
         this.selectors.searchButton
      );
   }

   debounce<T extends (...args: any[]) => void>(
      func: T,
      timeout: number = 300
   ): (...args: Parameters<T>) => void {
      let timer: ReturnType<typeof setTimeout>;
      return (...args: Parameters<T>) => {
         clearTimeout(timer);
         timer = setTimeout(() => {
            func.apply(this, args);
         }, timeout);
      };
   }

   searchCategory = this.debounce(async () => {
      let filterValue = this.inputElement.value.trim();
      FetchingService.fetchFilteredData("categories", filterValue).then(
         (data) => {
            if (data) this.categoriesListElement.innerHTML = data;
         }
      );
   }, 500);

   onMouseClick = (event: any) => {
      const { target } = event;

      if (target.closest(this.selectors.categoryCardButton)) {
         const categoryId = target.getAttribute("id");
         localStorage.setItem("selectedCategoryId", categoryId);
      }
   };

   bindEvents() {
      this.inputElement.addEventListener("input", this.searchCategory);
      this.searchButtonElement.addEventListener("click", this.searchCategory);
      document.addEventListener("click", this.onMouseClick);
   }
}

class CategoriesListCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new CategoriesList(element);
         }
      });
   }
}

export default CategoriesListCollection;
