

export interface CartItem {
    itemId: number;
    name: string;
    price: number;
    quantity: number;
    pictureUrl: string
    
}
export interface ShoppingCart {
        id: string;
        items: CartItem[];
        totalPrice: number
    }