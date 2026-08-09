import { useRef, useState } from "react";
import type { Post } from "../api/api";
import "../PostItem.css";

interface PostItemProps {
  post: Post;
  isAdmin: boolean;
  onDelete: (postId: number) => Promise<void>;
}

function PostItem({ post, isAdmin, onDelete }: PostItemProps) {
  // dialog 요소에 직접 접근하기 위한 참조
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const handleDelete = async () => {
    if (!window.confirm("이 게시글을 삭제할까요?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(post.id);
      dialogRef.current?.close();
    } catch {
      // 오류 메시지는 App에서 표시
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <article className="post-row">
        <button
          type="button"
          className="post-title-button"
          onClick={openDialog}
        >
          {post.title}
        </button>

        <span className="post-author">{post.author.username}</span>
        <span className="post-id">{post.id}</span>

        <div className="post-actions">
          <button type="button" className="post-view-button" onClick={openDialog}>
            보기
          </button>

          {isAdmin && (
            <button
              type="button"
              className="post-delete-button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중" : "삭제"}
            </button>
          )}
        </div>
      </article>

      <dialog ref={dialogRef} className="post-dialog">
        <article className="post-modal">
          <form method="dialog">
            <button
              type="submit"
              className="post-modal-close"
              aria-label="게시글 닫기"
            >
              ×
            </button>
          </form>

          <h1 className="post-modal-title">{post.title}</h1>

          <div className="post-modal-author">
            <span>{post.author.username}</span>
          </div>

          <p className="post-modal-content">{post.content}</p>

          {isAdmin && (
            <button
              type="button"
              className="post-modal-delete"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "게시글 삭제"}
            </button>
          )}
        </article>
      </dialog>
    </>
  );
}

export default PostItem;
