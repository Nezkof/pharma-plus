class Header {
   private rootElement: any;
   private locationMenuButton;
   private locationMenuElement;

   selectors = {
      root: "[data-js-header]",
      locationMenuButton: "[data-js-header-location-menu-button]",
      locationMenuElement: "[data-js-location-search]",
   };

   stateClasses = {
      isExpanded: "is-expanded",
      isCurrent: "is-current",
   };

   stateAttributes = {
      ariaExpanded: "aria-expanded",
      ariaSelected: "aria-selected",
   };

   state = {
      isExpanded: false,
      currentOptionIndex: 0,
   };

   constructor() {
      this.rootElement = document.querySelector(this.selectors.root);
      this.locationMenuButton = this.rootElement?.querySelector(
         this.selectors.locationMenuButton
      );
      this.locationMenuElement = this.rootElement.querySelector(
         this.selectors.locationMenuElement
      );

      this.bindEvents();
   }

   onLocationMenuButtonClick = () => {
      this.state.isExpanded = !this.state.isExpanded;
      this.locationMenuButton?.classList.toggle(this.stateClasses.isExpanded);
      this.locationMenuElement.classList.toggle(this.stateClasses.isExpanded);
      this.locationMenuElement.setAttribute(
         this.stateAttributes.ariaExpanded,
         this.state.isExpanded
      );
   };

   bindEvents() {
      this.locationMenuButton?.addEventListener(
         "click",
         this.onLocationMenuButtonClick
      );
   }
}

export default Header;
