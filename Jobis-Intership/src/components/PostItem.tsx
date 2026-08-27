import { useRef, useState, type FormEvent } from "react";
import axios from "axios";
import type { Post } from "../api/api";
import "../PostItem.css";

interface PostItemProps {
  post: Post;
  isAdmin: boolean;
  currentUserId: number | null;
  onDelete: (postId: number) => Promise<void>;
  onUpdated: (
    postId: number,
    title: string,
    content: string,
  ) => Promise<Post>;
}

function PostItem({
  post,
  isAdmin,
  currentUserId,
  onDelete,
  onUpdated,
}: PostItemProps) {
  // dialog 요소에 직접 접근하기 위한 참조
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  // 백엔드 권한과 동일하게 작성자 또는 관리자만 수정 가능
  const canEdit = isAdmin || post.author.id === currentUserId;

  const openDialog = () => {
    setIsEditing(false);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditError(null);
    dialogRef.current?.showModal();
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditError(null);
  };

  const openEditDialog = () => {
    startEditing();
    dialogRef.current?.showModal();
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editTitle.trim() || !editContent.trim()) {
      setEditError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setEditError(null);

      const updatedPost = await onUpdated(
        post.id,
        editTitle.trim(),
        editContent.trim(),
      );

      setEditTitle(updatedPost.title);
      setEditContent(updatedPost.content);
      setIsEditing(false);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const status = requestError.response?.status;

        if (status === 401) {
          setEditError("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
          return;
        }

        if (status === 403) {
          setEditError("이 게시글을 수정할 권한이 없습니다.");
          return;
        }

        if (status === 404) {
          setEditError("게시글을 찾을 수 없습니다.");
          return;
        }

        if (!requestError.response) {
          setEditError("백엔드 서버에 연결할 수 없습니다.");
          return;
        }
      }

      setEditError("게시글을 수정하지 못했습니다.");
    } finally {
      setIsSaving(false);
    }
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

          {canEdit && (
            <button
              type="button"
              className="post-edit-button"
              onClick={openEditDialog}
            >
              수정
            </button>
          )}

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

          {isEditing ? (
            <form className="post-edit-form" onSubmit={handleUpdate}>
              <h1 className="post-modal-title">게시글 수정</h1>

              <label htmlFor={`edit-title-${post.id}`}>제목</label>
              <input
                id={`edit-title-${post.id}`}
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                placeholder="제목을 입력하세요"
              />

              <label htmlFor={`edit-content-${post.id}`}>내용</label>
              <textarea
                id={`edit-content-${post.id}`}
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                placeholder="내용을 입력하세요"
                rows={10}
              />

              {editError && (
                <p role="alert" className="post-edit-error">
                  {editError}
                </p>
              )}

              <div className="post-edit-actions">
                <button
                  type="button"
                  className="post-edit-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setEditError(null);
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="post-edit-submit"
                  disabled={isSaving}
                >
                  {isSaving ? "저장 중..." : "수정 완료"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="post-modal-title">{post.title}</h1>

              <div className="post-modal-author">
                <span>{post.author.username}</span>
              </div>

              <p className="post-modal-content">{post.content}</p>

              <div className="post-modal-actions">
                {canEdit && (
                  <button
                    type="button"
                    className="post-modal-edit"
                    onClick={startEditing}
                  >
                    게시글 수정
                  </button>
                )}

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
              </div>
            </>
          )}
        </article>
      </dialog>
    </>
  );
}

export default PostItem;
