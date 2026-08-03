import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export interface LoginResponse {
  token: string;
}

export async function login(username: string, password: string) {
  const response = await api.post<LoginResponse>("/login", {
    username,
    password,
  });

  return response.data;
}

export default api;
