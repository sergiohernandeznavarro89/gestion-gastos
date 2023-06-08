import { createSlice } from "@reduxjs/toolkit";
import { MenuState } from "store/models/MenuState";
import { UserState } from "store/models/UserState";

const menuSlice = createSlice({
    name: "menuState",
    initialState: {
        menuId: 0
    } as MenuState,
    reducers: {
        setMenu(state, action) {
            state.menuId = action.payload.menuId;
        },
    }
});

export const menuActions = menuSlice.actions;
export default menuSlice;