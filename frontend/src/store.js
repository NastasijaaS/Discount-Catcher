import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice.js";

export const store = configureStore({
    reducer: {
        user: userReducer
    }
})