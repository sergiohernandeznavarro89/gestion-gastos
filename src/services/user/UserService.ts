import axios from "axios";
import { UserResponse } from "models/user/UserResponse";

const API = "https://sergiohn89.somee.com";

export const getUserByEmail = async (email: string): Promise<UserResponse> => {
    const response = await axios.get<UserResponse>(`${API}/api/User/GetUserByEmail?email=${email}`);
    return response.data;
}