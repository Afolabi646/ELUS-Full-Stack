import { createSlice } from "@reduxjs/toolkit";

const initialValue = { order: [] };
console.log("Initial Order State:", initialValue);

const orderSlice = createSlice({
  name: "order",
  initialState: initialValue,
  reducers: {
    setOrder: (state, action) => {
      console.log("Setting Order:", action.payload);
      state.order = [...action.payload];
    },
  },
});

export const { setOrder } = orderSlice.actions;
export default orderSlice.reducer;
