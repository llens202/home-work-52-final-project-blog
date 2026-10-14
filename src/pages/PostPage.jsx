import '../styles/PostPage.css'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';



function PostPage() {
    const { id } = useParams();
    const postId = Number(id);

    const posts = useSelector(state => state.posts.posts);

    const post = posts.find(post => {
        return post.id === postId
    });

    const imageSrc = post?.imageUrl || post?.image;

    if (!post) {
        return <h1>Пост не знайдено</h1>
    }

    return (
        <div className="post-page">
            <h2>Сторінка поста: {post.title}</h2>
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt={post.title}
                />
            )}
            <p>Категорія: {post.category}</p>
            <p>{post.description}</p>
            <p className="post-author">автор: {post.author}</p>
            <p>дата поста: {post.date}</p>
        </div>


    )
}

export default PostPage;