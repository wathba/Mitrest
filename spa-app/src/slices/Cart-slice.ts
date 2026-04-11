import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types/cart-type";


type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i.itemId === action.payload.itemId);

      if (existing) {
        existing.quantity++;
      } else {
        state.items.push(action.payload );
      }
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.itemId !== action.payload);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ itemId: number; quantity: number }>
    ) => {
      const item = state.items.find(i => i.itemId === action.payload.itemId);
      if (item) item.quantity = action.payload.quantity;
    },
  },
});

export const { setCart, addItem, removeItem, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;