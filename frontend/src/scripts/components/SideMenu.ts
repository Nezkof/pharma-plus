const rootSelector = "[data-js-side-menu]";

class SideMenu {
   private rootElement: HTMLElement;

   selectors = {
      root: rootSelector,
      link: "[data-js-side-menu-link]",
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;

      this.bindEvents();
   }

   onMouseClick = (event: any) => {
      const { target } = event;

      const closestLink = target.closest(this.selectors.link);

      if (closestLink) {
         const categoryId = closestLink.getAttribute("id");
         localStorage.setItem("selectedCategoryId", categoryId);
      }
   };

   bindEvents() {
      this.rootElement.addEventListener("click", this.onMouseClick);
   }
}

class SideMenuCollection {
   constructor() {
      this.init();
   }

   init() {
      document.querySelectorAll(rootSelector).forEach((element) => {
         if (element instanceof HTMLElement) {
            new SideMenu(element);
         }
      });
   }
}

export default SideMenuCollection;
