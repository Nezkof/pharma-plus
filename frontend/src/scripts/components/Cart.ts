import { safeFieldInit } from "./../helpers.ts";
import OrderItem from "./OrderItem";
import FetchingService from "../../services/fetchingManager.service.ts";
import { cartService } from "../../services/cartManager.service.ts";
import { DataPreparationService } from "../../services/dataPreparation.service.ts";
import DOMParserService from "../../services/DOMParser.service.ts";

const rootSelector = "[data-js-cart]";

class Cart {
   private rootElement: HTMLElement;
   private ordersListElement: HTMLElement;
   private orderItemsList!: OrderItem[];
   private orderListContainerElement: HTMLElement;
   private deliverySectionElement: HTMLElement;
   private priceElement: HTMLElement;

   selectors = {
      root: rootSelector,
      ordersList: "[data-js-cart-orders-list]",
      cartTotalPrice: "[data-js-cart-total-price]",
      selectDeliveryButton: "[data-js-card-select-delivery-button]",
      orderListContainer: "[data-js-cart-order-list-container]",

      deliverySection: "[data-js-cart-delivery-section]",
   };

   stateClasses = {
      isActive: "is-active",
   };

   state = {
      price: 0,
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;
      this.orderItemsList = [];
      this.orderListContainerElement = safeFieldInit(
         rootElement,
         this.selectors.orderListContainer
      );
      this.ordersListElement = safeFieldInit(
         rootElement,
         this.selectors.ordersList
      );
      this.priceElement = safeFieldInit(
         rootElement,
         this.selectors.cartTotalPrice
      );

      this.deliverySectionElement = safeFieldInit(
         rootElement,
         this.selectors.deliverySection
      );

      cartService.cartItem$.subscribe((cartItems) => {
         this.initOrderItems(cartItems);
      });

      this.bindEvents();
   }

   async initOrderItems(cartItems: any[]) {
      this.orderItemsList = [];
      const data = DataPreparationService.getPreparedData(cartItems);

      await this.renderCartItems(data);

      cartItems.forEach((orderItemData) => {
         this.orderItemsList.push(new OrderItem(orderItemData));
      });

      this.updatePrice();
   }

   async renderCartItems(data: any) {
      return FetchingService.fetchOrderItem(`cart/render`, data).then(
         (data) => {
            const orderItems = DOMParserService.toDOM(
               data,
               this.selectors.ordersList
            );

            if (!orderItems) return;

            if (
               this.ordersListElement &&
               this.orderListContainerElement.contains(this.ordersListElement)
            ) {
               this.orderListContainerElement.replaceChild(
                  orderItems,
                  this.ordersListElement
               );
            } else {
               this.orderListContainerElement.appendChild(orderItems);
            }

            this.ordersListElement = safeFieldInit(
               this.orderListContainerElement,
               this.selectors.ordersList
            );
         }
      );
   }

   handleDeliverySelectionButtonClick = () => {
      this.deliverySectionElement.classList.add(this.stateClasses.isActive);
   };

   updatePrice() {
      this.state.price = 0;

      this.orderItemsList.forEach((orderItem) => {
         this.state.price += orderItem.getPrice();
      });

      this.priceElement.innerText = `$${this.state.price}`;
   }

   onMouseClick = (event: any) => {
      const target = event.target;

      if (target.closest(this.selectors.selectDeliveryButton)) {
         this.handleDeliverySelectionButtonClick();
      }

      this.updatePrice();
   };

   bindEvents() {
      this.rootElement.addEventListener("click", this.onMouseClick);
   }
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
