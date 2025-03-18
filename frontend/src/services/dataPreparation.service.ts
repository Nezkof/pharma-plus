export class DataPreparationService {
   private static prepareDataForBackend(rawData: any[]): any[] {
      return rawData.map((item) => {
         if (typeof item === "string") {
            return JSON.parse(item);
         }
         return item;
      });
   }

   public static getPreparedData(rawData: any[]) {
      const preparedData = this.prepareDataForBackend(rawData);

      try {
         return JSON.stringify(preparedData);
      } catch (error) {
         console.error("Data preparation error", error);
         throw error;
      }
   }
}
