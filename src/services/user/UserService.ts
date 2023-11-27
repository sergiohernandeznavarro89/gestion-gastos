import axios from "axios";
import { UserResponse } from "models/user/UserResponse";

const API = process.env.REACT_APP_API_BASE_URL;

export const GetUserByEmail = async (email: string): Promise<UserResponse> => {
    const response = await axios.get<UserResponse>(`${API}/api/User/GetUserByEmail?email=${email}`);
    return response.data;
}