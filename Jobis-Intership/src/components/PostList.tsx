import type { Post } from "../api/api";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
import "../Posts.css";

interface PostListProps {
  posts: Post[];
  token: string;
  isAdmin: boolean;
  currentUserId: number | null;
  onCreated: (post: Post) => void;
  onDelete: (postId: number) => Promise<void>;
  onUpdated: (
    postId: number,
    title: string,
    content: string,
  ) => Promise<Post>;
}

function PostList({
  posts,
  token,
  isAdmin,
  currentUserId,
  onCreated,
  onDelete,
  onUpdated,
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <section className="posts-section">
        <div className="posts-heading">
          <h2 className="posts-title">전체 게시글</h2>
          <PostForm token={token} onCreated={onCreated} />
        </div>
        <p className="posts-empty"> 아직 작성된 게시글이 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="posts-section">
      <div className="posts-heading">
        <h2 className="posts-title">전체 게시글</h2>
        <PostForm token={token} onCreated={onCreated} />
      </div>

      <div className="posts-table">
        <div className="posts-table-header" aria-hidden="true">
          <span>제목</span>
          <span>작성자</span>
          <span>번호</span>
          <span>관리</span>
        </div>

        <div className="posts-list">
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              isAdmin={isAdmin}
              currentUserId={currentUserId}
              onDelete={onDelete}
              onUpdated={onUpdated}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PostList;
