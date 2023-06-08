import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/UserSlice";
import menuSlice from "./reducers/MenuSlice";

const store = configureStore({
    reducer: {
        userState: userSlice.reducer,
        menuState: menuSlice.reducer
    }
});

export default store;