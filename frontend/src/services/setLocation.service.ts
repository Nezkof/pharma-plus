import { BehaviorSubject } from "rxjs";

class SetLocationService {
   private storageKey = "selectedCity";

   private userIdSubject = new BehaviorSubject<number>(-1);
   private userId$ = this.userIdSubject.asObservable();

   private citySubject = new BehaviorSubject<string>(
      localStorage.getItem(this.storageKey) || "Kyiv"
   );
   private city$ = this.citySubject.asObservable();

   public setUserId(newId: number) {
      this.userIdSubject.next(newId);
   }

   public setLocation(newCity: string) {
      this.citySubject.next(newCity);
      localStorage.setItem(this.storageKey, newCity);
   }

   public get getCity$() {
      return this.city$;
   }

   public get getUserId$() {
      return this.userId$;
   }
}

export default new SetLocationService();
