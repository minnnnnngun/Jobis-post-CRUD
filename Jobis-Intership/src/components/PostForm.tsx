import { useRef, useState, type FormEvent } from "react";
import axios from "axios";
import { createPost, type Post } from "../api/api";
import "../PostForm.css";

interface PostFormProps {
  token: string;
  onCreated: (post: Post) => void;
}

function PostForm({ token, onCreated }: PostFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newPost = await createPost(token, title.trim(), content.trim());
      onCreated(newPost);
      setTitle("");
      setContent("");
      dialogRef.current?.close();
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const status = requestError.response?.status;

        if (status === 401 || status === 403) {
          setError("로그인 정보가 만료되었습니다. 로그아웃 후 다시 로그인해주세요.");
          return;
        }

        if (status === 400) {
          setError("제목과 내용을 다시 확인해주세요.");
          return;
        }

        if (!requestError.response) {
          setError("백엔드 서버에 연결할 수 없습니다.");
          return;
        }
      }

      setError("게시글을 생성하지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    dialogRef.current?.close();
  };

  return (
    <>
      <button
        type="button"
        className="create-post-button"
        onClick={() => dialogRef.current?.showModal()}
      >
        새 게시글 작성
      </button>

      <dialog ref={dialogRef} className="post-form-dialog">
        <form className="post-form" onSubmit={handleSubmit}>
          <button
            type="button"
            className="post-form-close"
            onClick={handleClose}
            aria-label="게시글 작성창 닫기"
          >
            ×
          </button>

          <h2>새 게시글 작성</h2>

          <label htmlFor="post-title">제목</label>
          <input
            id="post-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 입력하세요"
          />

          <label htmlFor="post-content">내용</label>
          <textarea
            id="post-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="내용을 입력하세요"
            rows={8}
          />

          {error && <p role="alert" className="post-form-error">{error}</p>}

          <button type="submit" className="post-submit-button" disabled={isLoading}>
            {isLoading ? "작성 중..." : "작성 완료"}
          </button>
        </form>
      </dialog>
    </>
  );
}

export default PostForm;
