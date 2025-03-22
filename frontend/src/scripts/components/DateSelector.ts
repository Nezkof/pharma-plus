const rootSelector = "[data-js-date-selector]";

class DateSelector {
   private rootElement: HTMLElement;
   private datesListElement: NodeListOf<HTMLButtonElement>;

   selectors = {
      root: rootSelector,
      dateOption: "[data-js-date-selector-option]",
   };

   stateClasses = {
      isSelected: "is-selected",
   };

   stateAttributes = {
      ariaPressed: "aria-pressed",
      dateValue: "date-value",
   };

   state = {
      activeOptionIndex: 0,
   };

   constructor(rootElement: HTMLElement) {
      this.rootElement = rootElement;
      this.datesListElement = rootElement.querySelectorAll(
         this.selectors.dateOption
      );

      this.initDates();
      this.bindEvents();
   }

   initDates() {
      const today = new Date();
      let day = today.getDate();

      this.datesListElement.forEach((dateButton, index) => {
         day++;
         const nextDate = new Date(today.getFullYear(), today.getMonth(), day);

         dateButton.setAttribute(
            this.stateAttributes.dateValue,
            String(
               `${nextDate.getDate()}, ${nextDate.getMonth()}, ${nextDate.getFullYear()}`
            )
         );
         dateButton.textContent = String(nextDate.getDate());
      });
   }

   updateUI() {
      const { activeOptionIndex } = this.state;
      const activeElement = this.datesListElement[activeOptionIndex];

      this.datesListElement.forEach((element) => {
         element.classList.remove(this.stateClasses.isSelected);
         element.setAttribute(this.stateAttributes.ariaPressed, "false");
      });

      activeElement.classList.add(this.stateClasses.isSelected);
      activeElement.setAttribute(this.stateAttributes.ariaPressed, "true");
   }

   handleDatesClick(event: any) {
      let clickedIndex = -1;

      this.datesListElement.forEach((element, index) => {
         if (element === event.target) {
            clickedIndex = index;
         }
      });

      this.state.activeOptionIndex = clickedIndex;
      this.updateUI();
   }

   handleMouseClick = (event: any) => {
      if (event.target.matches(this.selectors.dateOption)) {
         this.handleDatesClick(event);
      }
   };

   bindEvents() {
      this.rootElement.addEventListener("click", this.handleMouseClick);
   }

   public getDate() {
      const { activeOptionIndex } = this.state;
      return this.datesListElement[activeOptionIndex].getAttribute(
         this.stateAttributes.dateValue
      );
   }
}

export default DateSelector;
