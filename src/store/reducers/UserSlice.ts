import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "store/models/UserState";

const userSlice = createSlice({
    name: "userState",
    initialState: {
        userId: 0,
        userName: "",
        userLastName: "",
        userEmail: "",
    } as UserState,
    reducers: {
        setUser(state, action) {
            state.userId = action.payload.userId;
            state.userName = action.payload.userName;
            state.userLastName = action.payload.userLastName;
            state.userEmail = action.payload.userEmail;
        },
    }
});

export const userActions = userSlice.actions;
export default userSlice;