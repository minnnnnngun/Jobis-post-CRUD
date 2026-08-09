import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export interface LoginResponse {
  token: string;
  user: Author;
}

export interface Author {
  id: number;
  username: string;
  role: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
}

export async function login(username: string, password: string) {
  const response = await api.post<LoginResponse>("/login", {
    username,
    password,
  });

  return response.data;
}

export async function getPosts(token: string) {
  const response = await api.get<Post[]>("/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createPost(
  token: string,
  title: string,
  content: string,
) {
  const response = await api.post<Post>(
    "/posts",
    { title, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function deletePost(token: string, postId: number) {
  await api.delete(`/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export default api;
