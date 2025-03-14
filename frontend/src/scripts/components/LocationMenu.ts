const rootSelector = "[data-js-header]";

interface State {
   isExpanded: boolean;
   isSearchFocused: boolean;
   currentOptionIndex: number;
   selectedOptionElement: HTMLElement | null;
}

class LocationMenu {
   private rootElement: HTMLElement;
   private buttonElement: HTMLButtonElement;
   private locationTitleElement: HTMLSpanElement;
   private dropdownElement: HTMLElement;
   private optionElements: NodeListOf<HTMLButtonElement>;
   private searchElement: HTMLInputElement;

   selectors = {
      root: rootSelector,
      button: "[data-js-header-location-menu-button]",
      locationTitle: "[data-js-location-name]",
      dropdown: "[data-js-location-dropdown]",
      search: "[data-js-location-search-input]",
      option: "[data-js-location-search-item]",
   };

   stateClasses = {
      isExpanded: "is-expanded",
      isSelected: "is-selected",
      isHidden: "is-hidden",
   };

   stateAttributes = {
      ariaExpanded: "aria-expanded",
      ariaSelected: "aria-selected",
   };

   state: State = {
      isExpanded: false,
      isSearchFocused: true,
      currentOptionIndex: 0,
      selectedOptionElement: null,
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;

      this.buttonElement = this.safeFieldInit<HTMLButtonElement>(
         this.selectors.button
      );

      this.locationTitleElement = this.safeFieldInit<HTMLSpanElement>(
         this.selectors.locationTitle
      );

      this.dropdownElement = this.safeFieldInit<HTMLElement>(
         this.selectors.dropdown
      );

      this.optionElements =
         this.dropdownElement.querySelectorAll(this.selectors.option) || null;

      this.searchElement = this.safeFieldInit<HTMLInputElement>(
         this.selectors.search
      );

      this.bindEvents();
   }

   safeFieldInit<T extends HTMLElement>(selector: string): T {
      const fieldToCheck = this.rootElement.querySelector<T>(selector);

      if (fieldToCheck) {
         return fieldToCheck;
      } else {
         throw new TypeError(`Element not found for selector: ${selector}`);
      }
   }

   updateUI() {
      const { isExpanded, currentOptionIndex } = this.state;

      const updateButton = () => {
         this.buttonElement.classList.toggle(
            this.stateClasses.isExpanded,
            isExpanded
         );

         this.buttonElement.setAttribute(
            this.stateAttributes.ariaExpanded,
            String(isExpanded)
         );

         if (this.locationTitleElement && this.state.selectedOptionElement) {
            this.locationTitleElement.textContent =
               this.state.selectedOptionElement.textContent || "";
         }
      };

      const updateInput = () => {
         this.searchElement.placeholder =
            this.state.selectedOptionElement?.textContent || "Enter city name";
      };

      const updateDropdown = () => {
         this.dropdownElement.classList.toggle(
            this.stateClasses.isExpanded,
            isExpanded
         );

         const selectedElement =
            this.optionElements?.[this.state.currentOptionIndex];

         if (selectedElement) {
            selectedElement.scrollIntoView({
               behavior: "smooth",
               block: "nearest",
            });
         }

         if (selectedElement.tagName === "INPUT") {
            this.searchElement.focus();
            this.state.isSearchFocused = true;
         } else if (this.state.isSearchFocused) {
            this.state.isSearchFocused = false;
            this.searchElement.blur();
            selectedElement.focus();
         }
      };

      const updateOptions = () => {
         this.optionElements.forEach((optionElement, index) => {
            const isCurrent = currentOptionIndex === index;

            optionElement.classList.toggle(
               this.stateClasses.isSelected,
               isCurrent
            );
         });
      };

      updateButton();
      updateDropdown();
      updateOptions();
      updateInput();
   }

   expand() {
      this.state.isExpanded = true;
      this.updateUI();
   }

   collapse() {
      this.state.isExpanded = false;
      this.updateUI();
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

   getFilteredOptions = async (url: string, options: RequestInit = {}) => {
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
   };

   searchCity = this.debounce(() => this.getFilteredOptions("url"));

   toggleExpandedState = () => {
      this.state.isExpanded = !this.state.isExpanded;
   };

   selectCurrentOption() {
      if (
         this.optionElements?.[this.state.currentOptionIndex] instanceof
         HTMLInputElement
      )
         return;

      this.state.selectedOptionElement =
         this.optionElements?.[this.state.currentOptionIndex] ?? null;
   }

   onButtonClick = () => {
      this.toggleExpandedState();
      this.updateUI();
   };

   onClick = (event: { target: any }) => {
      const { target } = event;
      const isButtonClick =
         target.closest(this.selectors.button) === this.buttonElement;
      const isOutsideDropdownClick =
         target.closest(this.selectors.dropdown) !== this.dropdownElement;

      if (!isButtonClick && isOutsideDropdownClick) {
         this.collapse();
         return;
      }
      const isOptionClick =
         target.closest(this.selectors.option) &&
         !target.closest(this.selectors.search);

      if (isOptionClick) {
         this.state.selectedOptionElement = target.closest(
            this.selectors.option
         );

         this.collapse();
      }

      this.updateUI();
   };

   onArrowUpKeyDown = () => {
      if (this.isNeedToExpand) {
         this.expand();
         return;
      }

      if (this.state.currentOptionIndex > 0) {
         this.state.currentOptionIndex--;
         this.updateUI();
      }
   };

   onArrowDownKeyDown = () => {
      if (this.isNeedToExpand) {
         this.expand();
         return;
      }

      if (
         this.optionElements &&
         this.state.currentOptionIndex < this.optionElements.length - 1
      ) {
         this.state.currentOptionIndex++;
         this.updateUI();
      }
   };

   onSpaceKeyDown = () => {
      if (this.isNeedToExpand) {
         this.expand();
         return;
      }

      this.selectCurrentOption();
      this.collapse();
   };

   onEnterKeyDown = () => {
      if (this.isNeedToExpand) {
         this.expand();
         return;
      }

      this.selectCurrentOption();
      this.collapse();
   };

   onKeyDown = (event: KeyboardEvent) => {
      const { code } = event;

      const action = {
         ArrowUp: this.onArrowUpKeyDown,
         ArrowDown: this.onArrowDownKeyDown,
         Space: this.onSpaceKeyDown,
         Enter: this.onEnterKeyDown,
      }[code];

      if (action) {
         event.preventDefault();
         action();
      }
   };

   get isNeedToExpand() {
      const isButtonFocused = document.activeElement === this.buttonElement;

      return !this.state.isExpanded && isButtonFocused;
   }

   bindEvents() {
      this.buttonElement.addEventListener("click", this.onButtonClick);
      this.rootElement.addEventListener("keydown", this.onKeyDown);
      this.searchElement.addEventListener("input", this.searchCity);
      document.addEventListener("click", this.onClick);
   }
}

class LocationMenuCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new LocationMenu(element);
         }
      });
   }
}

export default LocationMenuCollection;
