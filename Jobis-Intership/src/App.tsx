import { useState } from "react";
import LoginForm from "./components/LoginForm";

function App() {
  // 로그인 성공 시 JWT 토큰 저장
  const [token, setToken] = useState("");

  const handleLogout = () => {
    // 토큰을 초기화하면 로그인 화면으로 돌아감
    setToken("");
  };

  // 토큰이 없으면 로그인 화면 표시
  if (!token) {
    return <LoginForm onLogin={setToken} />;
  }

  // 토큰이 있으면 로그인 이후 화면 표시
  return (
    <main>
      <header>
        <h1>게시판</h1>

        <button type="button" onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      <p>로그인에 성공했습니다.</p>
    </main>
  );
}

export default App;
