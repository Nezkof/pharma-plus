import { safeFieldInit } from "../helpers";

class AddressSelector {
   private rootElement: HTMLElement;

   private streetInputElement: HTMLInputElement;
   private houseInputElement: HTMLInputElement;
   private apartmentInputElement: HTMLInputElement;

   selectors = {
      streetInput: "[data-js-address-selector-street-input]",
      houseInput: "[data-js-address-selector-house-input]",
      apartmentInput: "[data-js-address-selector-apartment-input]",
   };

   state = {
      street: "",
      house: "",
      apartment: "",
   };

   stateClasses = {
      isInvalid: "is-invalid",
   };

   stateRegexes = {
      street: /[^a-zA-Zа-яА-ЯіІєЄїЇs]/g,
      house: /[^0-9]/g,
      apartment: /[^0-9]/g,
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;

      this.streetInputElement = safeFieldInit(
         this.rootElement,
         this.selectors.streetInput
      );
      this.houseInputElement = safeFieldInit(
         this.rootElement,
         this.selectors.houseInput
      );
      this.apartmentInputElement = safeFieldInit(
         this.rootElement,
         this.selectors.apartmentInput
      );

      this.bindEvents();
   }

   handleInput = (event: any) => {
      const { target } = event;

      const inputMap = {
         [this.selectors.streetInput]: {
            regex: this.stateRegexes.street,
            stateKey: "street",
         },
         [this.selectors.houseInput]: {
            regex: this.stateRegexes.house,
            stateKey: "house",
         },
         [this.selectors.apartmentInput]: {
            regex: this.stateRegexes.apartment,
            stateKey: "apartment",
         },
      };

      Object.entries(inputMap).forEach(([selector, { regex, stateKey }]) => {
         if (target.closest(selector)) {
            target.value = target.value.replace(regex, "");
            this.state[stateKey] = target.value;
         }
      });
   };

   bindEvents() {
      this.rootElement.addEventListener("input", this.handleInput);
   }

   public validateFields(): boolean {
      let result = true;

      [
         this.streetInputElement,
         this.houseInputElement,
         this.apartmentInputElement,
      ].forEach((inputField) => {
         const isEmpty = inputField.value.trim() === "";
         inputField.classList.toggle(this.stateClasses.isInvalid, isEmpty);
         if (isEmpty) result = false;
      });

      return result;
   }

   public getAddress() {
      return this.state.street || this.state.house || this.state.apartment
         ? `${this.state.street},${this.state.house},${this.state.apartment}`
         : null;
   }
}

export default AddressSelector;
