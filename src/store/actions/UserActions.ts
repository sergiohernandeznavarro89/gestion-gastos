import { UserResponse } from "models/user/UserResponse";
import { userActions } from '../reducers/UserSlice'

export const SetUser = (user: UserResponse) => {
    return (dispatch: any) => {
        dispatch(userActions.setUser({
            userId: user.userId,
            userEmail: user.userEmail,
            userName: user.userName,
            userLastName: user.userLastName
        }));
    };
};