import { UserResponse } from "models/user/UserResponse";
import { menuActions } from '../reducers/MenuSlice'
import { MenuState } from "store/models/MenuState";

export const SetMenu = (menu: MenuState) => {
    return (dispatch: any) => {
        dispatch(menuActions.setMenu({
            menuId: menu.menuId,
        }));
    };
};