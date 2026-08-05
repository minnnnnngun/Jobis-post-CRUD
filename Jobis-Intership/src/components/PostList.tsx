import type { Post } from "../api/api";
import "../Posts.css";

interface PostListProps {
  posts: Post[];
}

function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <section className="posts-section">
        <h2 className="posts-title"> 전체 게시글 </h2>
        <p className="posts-empty"> 아직 작성된 게시글이 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="posts-section">
      <h2 className="posts-title"> 전체 게시글 </h2>

      <div className="posts-grid">
        {posts.map((post) => (
          <article className="post-card" key={post.id}>
            <p className="post-id"> 게시글 ID: {post.id} </p>

            <h3 className="post-title"> {post.title} </h3>

            <p className="post-content"> {post.content} </p>

            <footer className="post-footer">
              <p> 작성자: {post.author.username}</p>
              <p> 권한: {post.author.role}</p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PostList;
