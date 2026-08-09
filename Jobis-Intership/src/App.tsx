import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  deletePost,
  getPosts,
  type Author,
  type Post,
} from "./api/api";
import LoginForm from "./components/LoginForm";
import PostList from "./components/PostList";
import "./App.css";

function App() {
  const navigate = useNavigate();

  // 로그인 성공 시 JWT 토큰 저장
  const [token, setToken] = useState(() => {
    // 새로고침 후에도 저장된 토큰 불러오기
    return localStorage.getItem("token") ?? "";
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<Author | null>(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser) as Author;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    // 토큰을 초기화하면 로그인 화면으로 돌아감
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setPosts([]);
    setError(null);
    navigate("/login");
  };

  const handleLogin = (loginToken: string, loginUser: Author) => {
    setToken(loginToken);
    setUser(loginUser);
    localStorage.setItem("token", loginToken);
    localStorage.setItem("user", JSON.stringify(loginUser));
    navigate("/posts");
  };

  const handleCreated = (newPost: Post) => {
    setPosts((currentPosts) => [...currentPosts, newPost]);
  };

  const handleDelete = async (postId: number) => {
    try {
      setError(null);
      await deletePost(token, postId);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId),
      );
    } catch {
      setError("게시글을 삭제하지 못했습니다.");
      throw new Error("게시글 삭제 실패");
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const postdata = await getPosts(token);

        setPosts(postdata);
      } catch (requestError) {
        // 토큰이 만료되었거나 잘못되면 로그인 상태 초기화
        if (
          axios.isAxiosError(requestError) &&
          (requestError.response?.status === 401 ||
            requestError.response?.status === 403)
        ) {
          setToken("");
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setPosts([]);
          navigate("/login");
          return;
        }

        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, [navigate, token]);

  const postsPage = (
    <main>
      <header className="board-header">
        <h1>게시판</h1>

        <button className="logout-button" type="button" onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      {isLoading && <p>게시글을 불러오는 중입니다.</p>}

      {error && <p role="alert"> {error} </p>}

      {!isLoading && (
        <PostList
          posts={posts}
          token={token}
          isAdmin={user?.role === "admin"}
          onCreated={handleCreated}
          onDelete={handleDelete}
        />
      )}
    </main>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          token ? <Navigate to="/posts" /> : <LoginForm onLogin={handleLogin} />
        }
      />

      <Route
        path="/posts"
        element={token ? postsPage : <Navigate to="/login" />}
      />

      <Route path="*" element={<Navigate to={token ? "/posts" : "/login"} />} />
    </Routes>
  );
}

export default App;
