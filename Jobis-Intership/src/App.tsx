import { useEffect, useState } from "react";
import { getPosts, type Post } from "./api/api";
import LoginForm from "./components/LoginForm";
import PostList from "./components/PostList";
import "./App.css";

function App() {
  // 로그인 성공 시 JWT 토큰 저장
  const [token, setToken] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    // 토큰을 초기화하면 로그인 화면으로 돌아감
    setToken("");
    setPosts([]);
    setError(null);
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

  // 토큰이 없으면 로그인 화면 표시
  if (!token) {
    return <LoginForm onLogin={setToken} />;
  }
  // 토큰이 있으면 로그인 이후 화면 표시
  return (
    <main>
      <header className="board-header">
        <h1>게시판</h1>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </header>

      {isLoading && <p>로그인에 성공했습니다.</p>}

      {error && <p role="alert"> {error} </p>}

      {!isLoading && !error && <PostList posts={posts} />}
    </main>
  );
}

export default App;
