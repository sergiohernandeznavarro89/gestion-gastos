import api from "../api";
import { UserResponse } from "models/user/UserResponse";

export const Login = async (email: string, password: string): Promise<{ token: string, user: UserResponse }> => {
    const response = await api.post(`/api/Auth/login`, { email, password });
    return response.data;
}

export const Register = async (userName: string, userLastName: string, email: string, password: string): Promise<any> => {
    const response = await api.post(`/api/Auth/register`, { userName, userLastName, email, password });
    return response.data;
}

export const GetUserByEmail = async (email: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/api/User/GetUserByEmail?email=${email}`);
    return response.data;
}