import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userContext/userContextSlice"

export const store = configureStore({
    reducer: {
        auth: userReducer,
    }
})