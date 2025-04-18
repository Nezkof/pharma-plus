import { Subscription } from "rxjs";
import { safeFieldInit, debounce } from "./../helpers.ts";
import FetchingService from "../../services/fetchingManager.service.ts";
import DOMParserService from "../../services/DOMParser.service.ts";
import PharmacyCardCollection from "./PharmacyCard.ts";
import setLocationService from "../../services/setLocation.service.ts";

const rootSelector = "[data-js-product-page]";

class Product {
   private citySubscription!: Subscription;
   private city!: string;

   private productId: string;
   private rootElement: HTMLElement;
   private productCardButtonElement!: HTMLElement;
   private productDetailsAccordeonElements!: NodeListOf<HTMLElement>;
   private pharmacyAddressInputElement!: HTMLInputElement;
   private pharmaciesListElement!: HTMLElement;
   private pharmaciesAccordionBodyElement!: HTMLElement;

   selectors = {
      root: rootSelector,
      productCard: "[data-js-product-card-large]",
      productCardButton: "[data-js-product-card-button]",
      productDetails: "[data-js-product-details]",
      detailsAccordion: "[data-js-details-accordion]",
      pharmacyAddressInput: "[data-js-pharmacy-address-input]",
      pharmaciesList: "[data-js-pharmacies-list]",
      pharmaciesAccordionBody: "[data-js-pharmacies-accordion-body]",
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;
      this.productId = localStorage.getItem("selectedProductId") || "";

      this.citySubscription = setLocationService.getCity$.subscribe(
         (city: any) => {
            this.city = city;
            this.fetchPharmaciesData();
            console.log("Нове місто:", city);
         }
      );

      this.fetchData().then(() => {
         this.init();
      });
   }

   init() {
      this.productCardButtonElement = safeFieldInit(
         this.rootElement,
         this.selectors.productCardButton
      );
      this.productDetailsAccordeonElements = this.rootElement.querySelectorAll(
         this.selectors.detailsAccordion
      );
      this.pharmacyAddressInputElement = safeFieldInit(
         this.rootElement,
         this.selectors.pharmacyAddressInput
      );
      this.pharmaciesListElement = safeFieldInit(
         this.rootElement,
         this.selectors.pharmaciesList
      );
      this.pharmaciesAccordionBodyElement = safeFieldInit(
         this.rootElement,
         this.selectors.pharmaciesAccordionBody
      );

      this.bindEvents();
   }

   async fetchData() {
      const productCardPromise = FetchingService.fetchTextData(
         `product/${this.productId}`
      ).then((data) => {
         const productCard = DOMParserService.toDOM(
            data,
            this.selectors.productCard
         );
         if (productCard) this.rootElement.appendChild(productCard);
      });

      const productDetailsPromise = FetchingService.fetchTextData(
         `product/product-details/${this.productId}/city/${this.city}`
      ).then((data) => {
         const productDetails = DOMParserService.toDOM(
            data,
            this.selectors.productDetails
         );
         if (productDetails) this.rootElement.appendChild(productDetails);
         new PharmacyCardCollection();
      });

      await Promise.all([productCardPromise, productDetailsPromise]);
   }

   onCardButtonClick = () => {
      this.productDetailsAccordeonElements.forEach((element) => {
         element.removeAttribute("open");
      });

      const lastElement =
         this.productDetailsAccordeonElements[
            this.productDetailsAccordeonElements.length - 1
         ];
      lastElement.setAttribute("open", "true");
   };

   async fetchPharmaciesData() {
      let queryString = "?filter=";

      const inputValue = this.pharmacyAddressInputElement
         ? this.pharmacyAddressInputElement.value.trim()
         : "";

      if (inputValue) {
         queryString += inputValue;
      }

      if (this.pharmacyAddressInputElement) {
         FetchingService.fetchTextData(
            `product/product-details/${this.productId}/city/${this.city}${queryString}`
         ).then((data) => {
            const pharmaciesList = DOMParserService.toDOM(
               data,
               this.selectors.pharmaciesList
            );

            if (!pharmaciesList) return;

            if (
               this.pharmaciesListElement &&
               this.pharmaciesAccordionBodyElement.contains(
                  this.pharmaciesListElement
               )
            ) {
               this.pharmaciesAccordionBodyElement.replaceChild(
                  pharmaciesList,
                  this.pharmaciesListElement
               );
            } else {
               this.pharmaciesAccordionBodyElement.appendChild(pharmaciesList);
            }

            this.pharmaciesListElement = safeFieldInit(
               this.rootElement,
               this.selectors.pharmaciesList
            );
         });
      }
   }

   handleInputChange = debounce(async () => {
      this.fetchPharmaciesData();
   }, 500);

   bindEvents() {
      this.productCardButtonElement.addEventListener(
         "click",
         this.onCardButtonClick
      );
      this.pharmacyAddressInputElement.addEventListener(
         "input",
         this.handleInputChange
      );
   }
}

class ProductCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new Product(element);
         }
      });
   }
}

export default ProductCollection;
