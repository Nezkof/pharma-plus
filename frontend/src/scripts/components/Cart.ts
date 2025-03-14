import { safeFieldInit } from "./../helpers.ts";
import { IOrderItemData } from "./interfaces.ts";
import OrderItem from "./OrderItem";

const rootSelector = "[data-js-cart]";

class Cart {
   private rootElement: HTMLElement;
   // private orderItemsListElement: HTMLElement;
   // private orderItems: OrderItem[];
   private selectDeliveryButtonElement: HTMLButtonElement;
   private deliverySectionElement: HTMLElement;

   selectors = {
      root: rootSelector,
      ordersList: "[data-js-cart-orders-list]",
      selectDeliveryButton: "[data-js-card-select-delivery-button]",
      deliverySection: "[data-js-cart-delivery-section]",
   };

   stateClasses = {
      isActive: "is-active",
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;
      this.selectDeliveryButtonElement = safeFieldInit(
         rootElement,
         this.selectors.selectDeliveryButton
      );

      this.deliverySectionElement = safeFieldInit(
         rootElement,
         this.selectors.deliverySection
      );

      this.bindEvents();

      // this.orderItems = [];

      // this.orderItemsListElement = safeFieldInit(
      //    rootElement,
      //    this.selectors.ordersList
      // );
   }

   handleDeliverySelectionButtonClick = () => {
      this.deliverySectionElement.classList.add(this.stateClasses.isActive);
   };

   bindEvents() {
      this.selectDeliveryButtonElement.addEventListener(
         "click",
         this.handleDeliverySelectionButtonClick
      );
   }

   // public addOrderItem(item: OrderItem) {
   //    this.orderItems.push(item);
   // }
}

class CartCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new Cart(element);
         }
      });
   }
}

export default CartCollection;
