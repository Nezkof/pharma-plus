import { safeFieldInit } from "../helpers";
import AddressSelector from "./AddressSelector";
import DateSelector from "./DateSelector";

const rootSelector = "[data-js-order-to-confirm-item]";

class OrderItem {
   private rootElement: HTMLElement | null;

   private courierDeliveryButtonElement!: HTMLElement;
   private selfDeliveryButton!: HTMLElement;
   private addressSelectorElement!: HTMLElement;

   private dateSelector!: DateSelector;
   private addressSelector!: AddressSelector;

   selectors = {
      root: rootSelector,

      courierDeliveryButton:
         "[data-js-order-to-confirm-courier-delivery-button]",
      selfDeliveryButton: "[data-js-order-to-confirm-self-delivery-button]",

      addressSelector: "[data-js-address-selector]",
      dateSelector: "[data-js-date-selector]",
   };

   stateClasses = {
      isActive: "is-active",
   };

   state = {
      itemId: 0,
      deliveryType: 0,
   };

   constructor(orderItemData: any) {
      this.state.itemId = orderItemData.pharmacy_product_id;

      this.rootElement = document.querySelector(
         `${this.selectors.root}[id="${this.state.itemId}"]`
      );

      if (!this.rootElement) return;

      this.courierDeliveryButtonElement = safeFieldInit(
         this.rootElement,
         this.selectors.courierDeliveryButton
      );
      this.selfDeliveryButton = safeFieldInit(
         this.rootElement,
         this.selectors.selfDeliveryButton
      );
      this.addressSelectorElement = safeFieldInit(
         this.rootElement,
         this.selectors.addressSelector
      );

      this.dateSelector = new DateSelector(
         safeFieldInit(this.rootElement, this.selectors.dateSelector)
      );

      this.addressSelector = new AddressSelector(
         safeFieldInit(this.rootElement, this.selectors.addressSelector)
      );

      this.bindEvents();
   }

   updateUI() {
      if (this.state.deliveryType === 0) {
         this.courierDeliveryButtonElement.classList.remove(
            this.stateClasses.isActive
         );
         this.selfDeliveryButton.classList.add(this.stateClasses.isActive);

         this.addressSelectorElement.classList.remove(
            this.stateClasses.isActive
         );
      } else {
         this.courierDeliveryButtonElement.classList.add(
            this.stateClasses.isActive
         );
         this.selfDeliveryButton.classList.remove(this.stateClasses.isActive);
         this.addressSelectorElement.classList.add(this.stateClasses.isActive);
      }
   }

   handleCourierDeliveryButton = () => {
      this.state.deliveryType = 1;
      this.updateUI();
   };

   handleSelfDeliveryButton = () => {
      this.state.deliveryType = 0;
      this.updateUI();
   };

   bindEvents() {
      this.courierDeliveryButtonElement.addEventListener(
         "click",
         this.handleCourierDeliveryButton
      );

      this.selfDeliveryButton.addEventListener(
         "click",
         this.handleSelfDeliveryButton
      );
   }

   public isOrdersValid(): boolean {
      if (this.state.deliveryType === 1) {
         if (!this.addressSelector.validateFields()) return false;
         else return true;
      } else return true;
   }

   public getData() {
      const courierDeliveryAddress = this.addressSelector.getAddress();

      return {
         pharmacyProductId: this.state.itemId,
         isSelfDelivery: Boolean(!this.state.deliveryType),
         courierDeliveryAddress: courierDeliveryAddress,
         deliveryDate: this.dateSelector.getDate(),
      };
   }
}

export default OrderItem;
