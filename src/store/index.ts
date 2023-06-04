import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/UserSlice";

const store = configureStore({
    reducer: {
        userState: userSlice.reducer
    }
});

export default store;