import DOMParserService from "../../services/DOMParser.service";
import FetchingService from "../../services/fetchingManager.service";
import setLocationService from "../../services/setLocation.service";
import { debounce, safeFieldInit } from "../helpers";

const rootSelector = "[data-js-header]";

interface State {
   isExpanded: boolean;
   isSearchFocused: boolean;
   currentOptionIndex: number;
   selectedOptionElement: HTMLElement | null;
}

class LocationMenu {
   private rootElement: HTMLElement;
   private buttonElement!: HTMLButtonElement;
   private locationTitleElement!: HTMLSpanElement;
   private dropdownElement!: HTMLElement;
   private optionElements!: NodeListOf<HTMLButtonElement>;
   private searchElement!: HTMLInputElement;
   private citiesListElement!: HTMLElement;

   selectors = {
      root: rootSelector,
      button: "[data-js-header-location-menu-button]",
      locationTitle: "[data-js-location-name]",

      dropdown: "[data-js-location-dropdown]",
      search: "[data-js-location-search-input]",
      option: "[data-js-location-search-item]",

      citiesList: "[data-js-location-dropdown-cities-list]",
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

      this.init();

      setLocationService.getCity$.subscribe((city) => {
         if (this.locationTitleElement) {
            this.locationTitleElement.textContent = city;
         }
      });

      this.bindEvents();
   }

   async init() {
      this.dropdownElement = safeFieldInit<HTMLElement>(
         this.rootElement,
         this.selectors.dropdown
      );

      this.buttonElement = safeFieldInit<HTMLButtonElement>(
         this.rootElement,
         this.selectors.button
      );

      this.locationTitleElement = safeFieldInit<HTMLSpanElement>(
         this.rootElement,
         this.selectors.locationTitle
      );

      this.searchElement = safeFieldInit<HTMLInputElement>(
         this.rootElement,
         this.selectors.search
      );

      await this.loadCities();
   }

   async loadCities() {
      const inputValue = this.searchElement.value.trim();

      return FetchingService.fetchFilteredData("citiesList", inputValue).then(
         (data) => {
            const citiesList = DOMParserService.toDOM(
               data,
               this.selectors.citiesList
            );

            if (!citiesList) return;

            this.dropdownElement.appendChild(citiesList);

            if (
               this.citiesListElement &&
               this.dropdownElement.contains(this.citiesListElement)
            ) {
               this.dropdownElement.replaceChild(
                  citiesList,
                  this.citiesListElement
               );
            } else {
               this.dropdownElement.appendChild(citiesList);
            }

            this.citiesListElement = safeFieldInit(
               this.rootElement,
               this.selectors.citiesList
            );

            this.optionElements =
               this.dropdownElement.querySelectorAll(this.selectors.option) ||
               null;
         }
      );
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

   searchCity = debounce(() => {
      this.loadCities();
   });

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

      if (this.state.selectedOptionElement?.textContent)
         this.setCity(this.state.selectedOptionElement.textContent);
   }

   onButtonClick = () => {
      this.toggleExpandedState();
      this.updateUI();
   };

   onClick = (event: any) => {
      const target = event.target;
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
         if (this.state.selectedOptionElement?.textContent)
            this.setCity(this.state.selectedOptionElement.textContent);
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

   setCity(newCity: string) {
      if (this.locationTitleElement && this.state.selectedOptionElement)
         this.locationTitleElement.textContent = newCity || "";

      setLocationService.setLocation(newCity);
   }

   get isNeedToExpand() {
      const isButtonFocused = document.activeElement === this.buttonElement;

      return !this.state.isExpanded && isButtonFocused;
   }

   bindEvents() {
      this.rootElement.addEventListener("keydown", this.onKeyDown);
      this.buttonElement.addEventListener("click", this.onButtonClick);
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
