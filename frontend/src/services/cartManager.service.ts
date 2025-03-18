import { BehaviorSubject } from "rxjs";

interface CartItem {
   pharmacy_product_id: number;
   pharmacy_name: string;
   address: string;
   image: string;
   title: string;
   description: string;
   category_id: number;
   price: number;
}

export class CartService {
   private localStorageKey = "cartItems";

   private cartItemsSubject = new BehaviorSubject<CartItem[]>(
      this.loadCartFromStorage()
   );

   public cartItem$ = this.cartItemsSubject.asObservable();

   constructor() {
      this.cartItem$.subscribe((cartItems) => {
         console.log("Cart updating:", cartItems);
      });
   }

   public addToCart(data: CartItem) {
      const currentCart = this.cartItemsSubject.getValue();

      const existingItem = currentCart.find(
         (item) => item.pharmacy_product_id === data.pharmacy_product_id
      );

      if (!existingItem) {
         currentCart.push({ ...data });
      }

      this.cartItemsSubject.next([...currentCart]);
      this.saveCartToStorage(currentCart);
   }

   public removeOrderItem(id: number) {
      const currentCart = this.cartItemsSubject.getValue();

      const updatedCart = currentCart.filter(
         (item) => item.pharmacy_product_id !== id
      );

      this.cartItemsSubject.next([...updatedCart]);
      this.saveCartToStorage(updatedCart);
   }

   private saveCartToStorage(cart: CartItem[]) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(cart));
   }

   public loadCartFromStorage(): CartItem[] {
      const storedCart = localStorage.getItem(this.localStorageKey);
      return storedCart ? JSON.parse(storedCart) : [];
   }
}

export const cartService = new CartService();
