import { safeFieldInit, getFilteredOptions } from "../helpers";

const rootSelector = "[data-js-categories-search]";

interface State {
   activeCategory: string | null;
}

class CategoriesSearch {
   private rootElement: HTMLElement;
   private inputElement: HTMLInputElement;
   private SearchButtonElement: HTMLButtonElement;
   private optionElements: NodeListOf<HTMLButtonElement>;
   private listOpenButtonElement: HTMLButtonElement;
   private listElement: HTMLElement;

   selectors = {
      root: rootSelector,
      input: "[data-js-categories-input]",
      searchButton: "[data-js-categories-search-button]",
      option: "[data-js-categories-option]",
      optionTitle: "[data-js-categories-title]",

      listOpenButton: "[data-js-open-list-button]",
      list: "[data-js-categories-list]",
   };

   stateClasses = {
      isActive: "is-active",
      isExpanded: "is-expanded",
   };

   state: State = {
      activeCategory: null,
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;
      this.inputElement = safeFieldInit(rootElement, this.selectors.input);
      this.SearchButtonElement = safeFieldInit(
         rootElement,
         this.selectors.searchButton
      );
      this.optionElements = rootElement.querySelectorAll(this.selectors.option);

      this.listOpenButtonElement = safeFieldInit(
         rootElement,
         this.selectors.listOpenButton
      );

      this.listElement = safeFieldInit(rootElement, this.selectors.list);

      this.bindEvents();
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

   searchCategory = this.debounce(() => getFilteredOptions("url"));

   handleListButton() {
      this.listOpenButtonElement.classList.toggle(this.stateClasses.isExpanded);
      this.listElement.classList.toggle(this.stateClasses.isExpanded);
   }

   closeList() {
      this.listOpenButtonElement.classList.remove(this.stateClasses.isExpanded);
      this.listElement.classList.remove(this.stateClasses.isExpanded);
   }

   onMouseClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target === this.listOpenButtonElement) {
         this.handleListButton();
      }

      const button = target.closest(this.selectors.option);
      if (!button) return;

      this.optionElements.forEach((el) =>
         el.classList.remove(this.stateClasses.isActive)
      );

      button.classList.add(this.stateClasses.isActive);
      this.state.activeCategory =
         button?.querySelector(this.selectors.optionTitle)?.textContent || null;
      this.closeList();
   };

   bindEvents() {
      this.rootElement.addEventListener("click", this.onMouseClick);
      this.inputElement.addEventListener("input", this.searchCategory);
      this.SearchButtonElement.addEventListener("click", this.searchCategory);
   }
}

class CategoriesSearchCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new CategoriesSearch(element);
         }
      });
   }
}

export default CategoriesSearchCollection;
