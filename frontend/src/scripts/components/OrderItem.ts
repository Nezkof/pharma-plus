import { safeFieldInit } from "./../helpers.ts";
import { IOrderItemData } from "./interfaces.ts";
import BlistersCounter from "./BlistersCounter.ts";
import PackagesCounter from "./PackagesCounter.ts";

const rootSelector = "[data-js-order-item]";

class OrderItem {
   private rootElement: HTMLElement;
   private pharmacyNameElement: HTMLElement;
   private pharmacyAddressElement: HTMLElement;
   private itemImageElement: HTMLElement;
   private itemNameElement: HTMLElement;
   private itemAttributesElement: HTMLElement;
   private packagesCounterElement: PackagesCounter;
   private blistersCounterElement: BlistersCounter;
   private itemPriceElement: HTMLElement;

   selectors = {
      root: rootSelector,
      pharmacyName: "[data-js-order-item-pharmacy-name]",
      pharmacyAddress: "[data-js-order-item-pharmacy-address]",
      itemImage: "[data-js-order-item-image]",
      itemName: "[data-js-order-item-name]",
      itemAttributes: "[data-js-order-item-attirbutes]",
      deleteButton: "[data-js-order-item-delete-button]",
      itemPrice: "[data-js-order-item-price]",
   };

   state = {
      pharmacyName: "",
      pharmacyAddress: "",
      productName: "",
      productAttributes: "",
      packagePrice: 0,
      blisterPrice: 0,
      orderPrice: 0,
   };

   constructor(rootElement: HTMLElement, data: IOrderItemData) {
      this.state = { ...this.state, ...data };

      this.rootElement = rootElement;

      this.pharmacyNameElement = safeFieldInit(
         rootElement,
         this.selectors.pharmacyName
      );
      this.pharmacyAddressElement = safeFieldInit(
         rootElement,
         this.selectors.pharmacyAddress
      );
      this.itemImageElement = safeFieldInit(
         rootElement,
         this.selectors.itemImage
      );
      this.itemNameElement = safeFieldInit(
         rootElement,
         this.selectors.itemName
      );
      this.itemAttributesElement = safeFieldInit(
         rootElement,
         this.selectors.itemAttributes
      );

      this.blistersCounterElement = new BlistersCounter(rootElement);
      this.packagesCounterElement = new PackagesCounter(rootElement);

      this.itemPriceElement = safeFieldInit(
         rootElement,
         this.selectors.itemPrice
      );

      this.applyState();
      this.bindEvents();
   }

   applyState() {
      this.pharmacyNameElement.textContent = this.state.pharmacyName;
      this.pharmacyAddressElement.textContent = this.state.pharmacyAddress;
      this.itemNameElement.textContent = this.state.productName;
      this.itemAttributesElement.textContent = this.state.productAttributes;
   }

   updateStates() {
      this.state.orderPrice =
         this.state.blisterPrice *
            this.blistersCounterElement.getCounterValue() +
         this.state.packagePrice *
            this.packagesCounterElement.getCounterValue();

      this.updateUI();
   }

   updateUI() {
      this.itemPriceElement.textContent = `$${this.state.orderPrice}`;
   }

   handleDeleteButtonClick = () => {
      console.log("delete button clicked");
   };

   handleMouseClick = (event: any) => {
      if (event.target.matches(this.selectors.deleteButton)) {
         this.handleDeleteButtonClick();
      }

      this.updateStates();
   };

   bindEvents() {
      this.rootElement.addEventListener("click", this.handleMouseClick);
   }
}

class OrderItemCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            const data: IOrderItemData = {
               pharmacyName: "Pharmacy",
               pharmacyAddress: "Address",
               productName: "Product",
               productAttributes: "attributes",
               blisterPrice: 1,
               packagePrice: 2,
            };

            new OrderItem(element, data);
         }
      });
   }
}

export default OrderItemCollection;
// export default OrderItem;
