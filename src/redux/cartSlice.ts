import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ICartItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  unit?: string;
  category?: string;
}

interface CartState {
  cartItems: ICartItem[];
  totalQuantity: number;
  totalAmount: number;
}

const initialState: CartState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<ICartItem, 'quantity'>>) => {
      const newItem = action.payload;
      
      const existingItem = state.cartItems.find(
        (item) => item._id === newItem._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          ...newItem,
          quantity: 1,
        });
      }

      state.totalQuantity += 1;
      state.totalAmount += newItem.price;
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === id);

      if (existingItem) {
        existingItem.quantity += 1;
        state.totalQuantity += 1;
        state.totalAmount += existingItem.price;
      }
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          // If quantity reaches 0, remove the item completely
          state.cartItems = state.cartItems.filter((item) => item._id !== id);
        } else {
          existingItem.quantity -= 1;
        }
        state.totalQuantity -= 1;
        state.totalAmount -= existingItem.price;
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.cartItems = state.cartItems.filter((item) => item._id !== id);
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { 
  addToCart, 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;