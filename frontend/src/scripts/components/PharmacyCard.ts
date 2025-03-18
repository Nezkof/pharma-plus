import { safeFieldInit } from "./../helpers.ts";
import { cartService } from "../../services/cartManager.service.ts";
import FetchingService from "../../services/fetchingManager.service.ts";

const rootSelector = "[data-js-pharmacy-card]";

class PharmacyCard {
   private productId: number | null;
   private pharmacyId: number | null;
   private rootElement: HTMLElement;
   private cartAddButtonElement: HTMLButtonElement;

   states = {
      lsSelectedProductId: "selectedProductId",
      lsItemName: "cartItems",
   };

   selectors = {
      root: rootSelector,
      cartAddButton: "[data-js-pharmacy-card-button]",
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;
      this.cartAddButtonElement = safeFieldInit(
         rootElement,
         this.selectors.cartAddButton
      );

      this.productId =
         Number(localStorage.getItem(this.states.lsSelectedProductId)) || null;
      this.pharmacyId = Number(this.rootElement.getAttribute("id")) || null;

      this.bindEvents();
   }

   handleButtonClick = () => {
      FetchingService.fetchJSON(
         `product/${this.productId}/pharmacies/${this.pharmacyId}`
      ).then((data) => {
         cartService.addToCart(data);
      });
   };

   bindEvents() {
      this.cartAddButtonElement.addEventListener(
         "click",
         this.handleButtonClick
      );
   }
}

class PharmacyCardCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new PharmacyCard(element);
         }
      });
   }
}

export default PharmacyCardCollection;
