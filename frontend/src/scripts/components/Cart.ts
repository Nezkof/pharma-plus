import { safeFieldInit } from "./../helpers.ts";
import OrderItem from "./OrderItem";
import FetchingService from "../../services/fetchingManager.service.ts";
import { cartService } from "../../services/cartManager.service.ts";
import { DataPreparationService } from "../../services/dataPreparation.service.ts";
import DOMParserService from "../../services/DOMParser.service.ts";
import OrderToConfirm from "./OrderToConfirm.ts";
import setLocationService from "../../services/setLocation.service.ts";

const rootSelector = "[data-js-cart]";

interface OrderData {
   pharmacyProductId: number | null;
   isSelfDelivery: boolean | null;
   courierDeliveryAddress: string | null;
   deliveryDate: string | null;
   quantity: number | null;
   itemPrice: number | null;
}

class Cart {
   private userCity!: string;
   private userId: number = -1;

   private rootElement: HTMLElement;

   private rawOrdersSectionElement!: HTMLElement;
   private rawOrdersElement!: HTMLElement;
   private priceElement!: HTMLElement;

   private orderItemObjects!: OrderItem[];
   private selectDeliveryButtonElement!: HTMLButtonElement;

   private deliverySectionElement!: HTMLElement;

   private orderToConfirmObjects!: OrderToConfirm[];

   private ordersToConfirmElement!: HTMLElement;

   private confirmOrderButtonElement!: HTMLButtonElement;

   selectors = {
      root: rootSelector,
      ordersList: "[data-js-cart-orders-list]",
      cartTotalPrice: "[data-js-cart-total-price]",
      selectDeliveryButton: "[data-js-card-select-delivery-button]",
      orderListContainer: "[data-js-cart-order-list-container]",

      deliverySection: "[data-js-cart-delivery-section]",
      ordersToConfirm: "[data-js-cart-orders-to-confirm-list]",

      confirmOrderButton: "[data-js-cart-confirm-order]",
   };

   stateClasses = {
      isActive: "is-active",
      isDisabled: "is-disabled",
   };

   state = {
      price: 0,
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;
      this.init();

      cartService.cartItem$.subscribe((cartItems) => {
         this.initRawOrdersSection(cartItems);
      });

      setLocationService.getCity$.subscribe((userCity) => {
         this.userCity = userCity;
      });

      setLocationService.getUserId$.subscribe((clientId) => {
         this.userId = clientId;
      });

      this.bindEvents();
   }

   init() {
      this.orderItemObjects = [];
      this.rawOrdersSectionElement = safeFieldInit(
         this.rootElement,
         this.selectors.orderListContainer
      );
      this.rawOrdersElement = safeFieldInit(
         this.rootElement,
         this.selectors.ordersList
      );
      this.priceElement = safeFieldInit(
         this.rootElement,
         this.selectors.cartTotalPrice
      );

      this.deliverySectionElement = safeFieldInit(
         this.rootElement,
         this.selectors.deliverySection
      );

      this.ordersToConfirmElement = safeFieldInit(
         this.deliverySectionElement,
         this.selectors.ordersToConfirm
      );

      this.confirmOrderButtonElement = safeFieldInit(
         this.rootElement,
         this.selectors.confirmOrderButton
      );

      this.selectDeliveryButtonElement = safeFieldInit(
         this.rootElement,
         this.selectors.selectDeliveryButton
      );

      cartService.cartItem$.subscribe((cartItems) => {
         if (!cartItems || cartItems.length === 0) {
            this.disableControlElements();
         }
      });
   }

   disableControlElements() {
      this.selectDeliveryButtonElement.classList.add(
         this.stateClasses.isDisabled
      );

      this.deliverySectionElement.classList.remove(this.stateClasses.isActive);
   }

   // RAW ORDERS SECTION
   async initRawOrdersSection(cartItems: any[]) {
      this.orderItemObjects = [];
      const data = DataPreparationService.getPreparedData(cartItems);

      await this.renderRawOrderItems(data);

      cartItems.forEach((orderItemData) => {
         this.orderItemObjects.push(new OrderItem(orderItemData));
      });

      this.updatePrice();
   }

   async renderRawOrderItems(data: any) {
      return FetchingService.fetchOrderItem(`cart/render`, data).then(
         (data) => {
            const orderItems = DOMParserService.toDOM(
               data,
               this.selectors.ordersList
            );

            if (!orderItems) return;

            if (
               this.rawOrdersElement &&
               this.rawOrdersSectionElement.contains(this.rawOrdersElement)
            ) {
               this.rawOrdersSectionElement.replaceChild(
                  orderItems,
                  this.rawOrdersElement
               );
            } else {
               this.rawOrdersSectionElement.appendChild(orderItems);
            }

            this.rawOrdersElement = safeFieldInit(
               this.rawOrdersSectionElement,
               this.selectors.ordersList
            );
         }
      );
   }

   updatePrice() {
      this.state.price = 0;

      this.orderItemObjects.forEach((orderItem) => {
         this.state.price += orderItem.getPrice();
      });

      this.priceElement.innerText = `$${this.state.price}`;
   }

   handleDeliverySelectionButtonClick = () => {
      this.deliverySectionElement.classList.add(this.stateClasses.isActive);

      cartService.cartItem$.subscribe((cartItems) => {
         console.log("Choose delivery");
         this.initOrdersToConfirmSection(cartItems);
      });
   };

   // DELIVERY SECTION
   async initOrdersToConfirmSection(cartItems: any[]) {
      this.orderToConfirmObjects = [];
      const data = DataPreparationService.getPreparedData(cartItems);
      await this.renderOrdersToConfirm(data);

      for (let i = 0; i < cartItems.length; ++i) {
         const orderItemData = {
            ...cartItems[i],
            quantity: this.orderItemObjects[i].getQuantity(),
         };

         this.orderToConfirmObjects.push(new OrderToConfirm(orderItemData));
      }
   }

   async renderOrdersToConfirm(data: any) {
      return FetchingService.fetchOrderItem(
         `cart/delivery-section/render`,
         data
      ).then((data) => {
         const orderItems = DOMParserService.toDOM(
            data,
            this.selectors.ordersToConfirm
         );

         if (!orderItems) return;

         if (
            this.ordersToConfirmElement &&
            this.deliverySectionElement.contains(this.ordersToConfirmElement)
         ) {
            this.deliverySectionElement.replaceChild(
               orderItems,
               this.ordersToConfirmElement
            );
         } else {
            this.deliverySectionElement.appendChild(orderItems);
         }

         this.ordersToConfirmElement = safeFieldInit(
            this.deliverySectionElement,
            this.selectors.ordersToConfirm
         );
      });
   }

   async setUserAddress(data: string) {
      data = `${this.userCity},` + data;

      if (this.userId !== -1) {
         const result = await FetchingService.setUserData(
            `user/${this.userId}`,
            data
         );

         if (result) {
            console.log("Data sending succesful:", result);
         } else {
            console.error("Data sending error");
         }
      } else {
         console.log("No user");
      }
   }

   handleConfirmOrderButton = () => {
      let isOrderValid = true;
      const orderData: OrderData[] = [];

      this.orderToConfirmObjects.forEach((orderItem) => {
         if (!orderItem.isOrdersValid()) isOrderValid = false;
         orderData.push({
            ...orderItem.getData(),
         });
      });

      if (isOrderValid) {
         console.log("Order confirmed:", orderData);
         if (orderData[0].courierDeliveryAddress)
            this.setUserAddress(orderData[0].courierDeliveryAddress);
      } else console.log("Order invalid");
   };

   onMouseClick = (event: any) => {
      const target = event.target;

      if (target.closest(this.selectors.selectDeliveryButton)) {
         this.handleDeliverySelectionButtonClick();
      }

      if (target.closest(this.selectors.confirmOrderButton)) {
         this.handleConfirmOrderButton();
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
