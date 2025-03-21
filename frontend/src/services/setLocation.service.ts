import { BehaviorSubject } from "rxjs";

class SetLocationService {
   private citySubject = new BehaviorSubject<string>("Kyiv");
   private city$ = this.citySubject.asObservable();

   public setLocation(newCity: string) {
      this.citySubject.next(newCity);
   }

   public get getCity$() {
      return this.city$;
   }
}

export default new SetLocationService();
