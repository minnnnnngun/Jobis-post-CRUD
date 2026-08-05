import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { getPosts, type Post } from "./api/api";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    // 토큰을 초기화하면 로그인 화면으로 돌아감
    setToken("");
    localStorage.removeItem("token");
    setPosts([]);
    setError(null);
    navigate("/login");
  };

  const handleLogin = (loginToken: string) => {
    setToken(loginToken);
    localStorage.setItem("token", loginToken);
    navigate("/posts");
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
      } catch {
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, [token]);

  const postsPage = (
    <main>
      <header className="board-header">
        <h1>게시판</h1>

        <button className="logout-button" type="button" onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      {isLoading && <p>로그인에 성공했습니다.</p>}

      {error && <p role="alert"> {error} </p>}

      {!isLoading && !error && <PostList posts={posts} />}
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
