import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: "user" | "vendor" | "admin";
  mobile?: string;
  image?: string;
}

interface IUserSlice {
  userData: IUser | null;
}

const initialState: IUserSlice = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IUser | null>) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;