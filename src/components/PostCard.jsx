import { Link } from 'react-router-dom';

function PostCard({ post }) {
  const imageSrc = post.imageUrl || post.image;

  return (
    <article className="post-card">
      <span className="post-category">{post.category}</span>

      <h2>{post.title}</h2>

      <div className="post-info">
        <p className="post-author">Автор: {post.author}</p>
        <p className="post-date">Дата: {post.date}</p>
      </div>

      {imageSrc && (
        <img
          src={imageSrc}
          alt={post.title}
        />
      )}

      <p className="post-description">{post.description}</p>

      <Link
        className="read-post-button"
        to={`/posts/${post.id}`}
      >
        Читати пост
        <span aria-hidden="true">→</span>
      </Link>
      
    </article>
  );

}

export default PostCard;