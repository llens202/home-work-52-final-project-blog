import { Link } from 'react-router-dom';

function PostCard({ post }) {
  const imageSrc = post.imageUrl || post.image;

  return (
    <article className="post-card">
      <h2>{post.title}</h2>

      {imageSrc && (
        <img
          src={imageSrc}
          alt={post.title}
          width="250"
        />
      )}

      <p>Категорія: {post.category}</p>
      <p>{post.description}</p>
      <p className="post-author">Автор: {post.author}</p>
      <p>Дата поста: {post.date}</p>

      <Link to={`/posts/${post.id}`}>Читати далі</Link>
    </article>
  );
}

 export default PostCard;