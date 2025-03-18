import { cartService } from "../../services/cartManager.service.ts";
import { safeFieldInit } from "./../helpers.ts";
import BlistersCounter from "./BlistersCounter.ts";
import PackagesCounter from "./PackagesCounter.ts";

const rootSelector = "[data-js-order-item]";

class OrderItem {
   private rootElement: HTMLElement | null;
   private packagesCounterElement!: PackagesCounter;
   private blistersCounterElement!: BlistersCounter;
   private itemPriceElement!: HTMLElement;

   selectors = {
      root: rootSelector,

      deleteButton: "[data-js-order-item-delete-button]",
      itemPrice: "[data-js-order-item-price]",
   };

   state = {
      pharmacy_product_id: 0,
      price: 0,
      orderPrice: 0,
   };

   constructor(data: any) {
      this.state = { ...this.state, ...data };

      this.rootElement = document.getElementById(
         String(this.state.pharmacy_product_id)
      );
      if (!this.rootElement) return;

      this.packagesCounterElement = new PackagesCounter(this.rootElement);

      this.itemPriceElement = safeFieldInit(
         this.rootElement,
         this.selectors.itemPrice
      );

      this.updateStates();
      this.bindEvents();
   }

   updateStates() {
      this.state.orderPrice =
         this.state.price * this.packagesCounterElement.getCounterValue();

      this.updateUI();
   }

   updateUI() {
      this.itemPriceElement.textContent = `$${this.state.orderPrice}`;
   }

   handleDeleteButtonClick = () => {
      cartService.removeOrderItem(this.state.pharmacy_product_id);
   };

   handleMouseClick = (event: any) => {
      if (event.target.matches(this.selectors.deleteButton)) {
         this.handleDeleteButtonClick();
      }

      this.updateStates();
   };

   bindEvents() {
      this.rootElement?.addEventListener("click", this.handleMouseClick);
   }

   public getPrice() {
      return this.state.orderPrice;
   }

   public getId() {
      return this.state.pharmacy_product_id;
   }
}

export default OrderItem;
