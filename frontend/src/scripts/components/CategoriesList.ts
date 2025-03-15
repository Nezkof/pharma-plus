import { safeFieldInit } from "../helpers";
import CategoriesService from "../../services/CategoriesService";

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
   private categoryCarts!: NodeListOf<HTMLElement>;

   selectors = {
      root: rootSelector,
      input: "[data-js-categories-input]",
      searchButton: "[data-js-categories-search-button]",
      categoriesList: "[data-js-categories-list]",
      option: "[data-js-categories-category-cart]",
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

      CategoriesService.loadCategories("categories").then((data) => {
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
      this.categoryCarts = this.rootElement.querySelectorAll(
         this.selectors.option
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
      CategoriesService.loadFilteredCategories("categories", filterValue).then(
         (data) => {
            if (data) this.categoriesListElement.innerHTML = data;
         }
      );
   }, 500);

   bindEvents() {
      this.inputElement.addEventListener("input", this.searchCategory);
      this.searchButtonElement.addEventListener("click", this.searchCategory);
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
