const rootSelector = "[data-js-header]";

interface State {
   isExpanded: boolean;
   isSearchFocused: boolean;
   currentOptionIndex: number;
   selectedOptionElement: HTMLElement | null;
}

class LocationMenu {
   private rootElement: HTMLElement;
   private buttonElement: HTMLButtonElement | null;
   private locationTitleElement: HTMLSpanElement | null;
   private dropdownElement: HTMLElement | null;
   private optionElements: NodeListOf<HTMLButtonElement> | null;
   private searchElement: HTMLElement | null;

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

      this.buttonElement = this.rootElement.querySelector(
         this.selectors.button
      );

      this.locationTitleElement =
         this.buttonElement?.querySelector(this.selectors.locationTitle) ||
         null;

      this.dropdownElement = this.rootElement.querySelector(
         this.selectors.dropdown
      );

      this.optionElements =
         this.dropdownElement?.querySelectorAll(this.selectors.option) || null;

      this.searchElement =
         this.dropdownElement?.querySelector(this.selectors.search) || null;

      this.bindEvents();
   }

   get isNeedToExpand() {
      const isButtonFocused = document.activeElement === this.buttonElement;

      return !this.state.isExpanded && isButtonFocused;
   }

   updateUI() {
      const { isExpanded, currentOptionIndex } = this.state;

      const updateButton = () => {
         this.buttonElement?.classList.toggle(
            this.stateClasses.isExpanded,
            isExpanded
         );

         this.buttonElement?.setAttribute(
            this.stateAttributes.ariaExpanded,
            String(isExpanded)
         );

         if (this.locationTitleElement && this.state.selectedOptionElement) {
            this.locationTitleElement.textContent =
               this.state.selectedOptionElement.textContent || "";
         }
      };

      const updateDropdown = () => {
         this.dropdownElement?.classList.toggle(
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

         if (selectedElement?.tagName === "INPUT") {
            this.searchElement?.focus();
            this.state.isSearchFocused = true;
         } else if (this.state.isSearchFocused) {
            this.state.isSearchFocused = false;
            this.searchElement?.blur();
            selectedElement?.focus();
         }
      };

      const updateOptions = () => {
         this.optionElements?.forEach((optionElement, index) => {
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
   }

   toggleExpandedState = () => {
      this.state.isExpanded = !this.state.isExpanded;
   };

   onButtonClick = () => {
      this.toggleExpandedState();
      this.updateUI();
   };

   expand() {
      this.state.isExpanded = true;
      this.updateUI();
   }

   collapse() {
      this.state.isExpanded = false;
      this.updateUI();
   }

   selectCurrentOption() {
      if (
         this.optionElements?.[this.state.currentOptionIndex].tagName == "INPUT"
      )
         return;

      this.state.selectedOptionElement =
         this.optionElements?.[this.state.currentOptionIndex] ?? null;
   }

   onClick = (event: { target: any }) => {
      const { target } = event;
      const isButtonClick =
         target.closest(this.selectors.button) === this.buttonElement;
      const isOutsideDropdownClick =
         target.closest(this.selectors.dropdown) !== this.dropdownElement;

      console.log(target);
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

   bindEvents() {
      this.buttonElement?.addEventListener("click", this.onButtonClick);
      this.rootElement.addEventListener("keydown", this.onKeyDown);
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
