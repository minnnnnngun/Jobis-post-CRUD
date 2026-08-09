import { useState, type FormEvent } from "react";
import { login, type Author } from "../api/api";
import "../Login.css";

interface LoginFormProps {
  onLogin: (token: string, user: Author) => void;
}
function Login({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    // 폼 제출 시 새로고침 방지
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 다시 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const loginData = await login(username, password);

      onLogin(loginData.token, loginData.user);
    } catch {
      setError("아이디 또는 비밀번호를 확인해주세요.");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Form-center">
      <header>
        <h1 className="Center-text">로그인</h1>
      </header>

      <main className="LoginPage">
        <form onSubmit={handleLogin} className="LoginForm">
          <div className="LoginForm-input">
            <div className="InputGroup">
              <label htmlFor="username">사용자 이름</label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="사용자 이름을 입력하세요"
                autoComplete="username"
              />
            </div>

            <div className="InputGroup">
              <label htmlFor="password">비밀번호</label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="LoginError" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;
