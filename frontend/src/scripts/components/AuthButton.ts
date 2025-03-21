import FetchingService from "../../services/fetchingManager.service.ts";
import { safeFieldInit } from "../helpers.ts";

const rootSelector = "[data-js-header]";

class AuthButton {
   private rootElement: HTMLElement;
   private authButtonElement: HTMLElement;

   selectors = {
      root: rootSelector,
      authButton: "[data-js-header-auth-button]",
   };

   stateText = {
      login: "Login",
      logout: "Logout",
   };

   state = {
      isLogged: false,
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;

      this.authButtonElement = safeFieldInit(
         rootElement,
         this.selectors.authButton
      );

      this.bindEvents();
   }

   updateUI() {
      const spanElement = this.authButtonElement?.querySelector("span");

      if (spanElement && this.state.isLogged) {
         spanElement.textContent = this.stateText.logout;
      } else if (spanElement) spanElement.textContent = this.stateText.login;
   }

   setUserId(clientId: number) {
      if (clientId) {
         console.log("User authenticated with client_id:", clientId);
         this.state.isLogged = true;
         this.updateUI();
      }
   }

   async fetchClientId() {
      FetchingService.fetchCookies("auth/get-client-id").then((clientId) => {
         this.setUserId(clientId);
      });
   }

   onAuthButtonClick = () => {
      if (!this.state.isLogged) {
         window.location.href = "http://localhost:8000/auth/google";
      } else {
         fetch("http://localhost:8000/auth/logout", {
            method: "GET",
            credentials: "include",
         })
            .then((response) => {
               if (response.ok) {
                  this.state.isLogged = false;
                  console.log("User logged out successfully");
                  this.updateUI();
               } else {
                  console.error("Logout failed");
               }
            })
            .catch((error) => {
               console.error("Error during logout:", error);
            });
      }
   };

   bindEvents() {
      this.authButtonElement.addEventListener("click", this.onAuthButtonClick);

      window.addEventListener("load", () => {
         this.fetchClientId();
      });
   }
}

class AuthButtonCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new AuthButton(element);
         }
      });
   }
}

export default AuthButtonCollection;
