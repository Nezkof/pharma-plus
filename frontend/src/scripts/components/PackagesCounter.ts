import { safeFieldInit } from "../helpers.ts";

class PackagesCounter {
   private rootElement: HTMLElement;
   private counterElement: HTMLElement;

   selectors = {
      root: "[data-js-packages-counter]",
      counter: "[data-js-packages-counter-counter]",
      increaseButton: "[data-js-packages-counter-increase-button]",
      decreaseButton: "[data-js-packages-counter-decrease-button]",
   };

   state = {
      counterValue: 0,
   };

   constructor(root: HTMLElement) {
      this.rootElement = safeFieldInit(root, this.selectors.root);
      this.counterElement = safeFieldInit(root, this.selectors.counter);

      this.bindEvents();
   }

   updateUI() {
      this.counterElement.textContent = String(this.state.counterValue);
   }

   handleIncreaseButtonClick() {
      this.state.counterValue++;

      this.updateUI();
   }

   handleDecreaseButtonClick() {
      if (this.state.counterValue > 0) {
         this.state.counterValue--;
         this.updateUI();
      }
   }

   handleMouseClick = (event: any) => {
      if (event.target.matches(this.selectors.decreaseButton)) {
         this.handleDecreaseButtonClick();
      }

      if (event.target.matches(this.selectors.increaseButton)) {
         this.handleIncreaseButtonClick();
      }
   };

   bindEvents() {
      this.rootElement.addEventListener("click", this.handleMouseClick);
   }

   public getCounterValue(): number {
      return this.state.counterValue;
   }
}

export default PackagesCounter;
