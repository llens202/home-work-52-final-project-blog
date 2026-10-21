
import '../styles/PostPage.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { removePost } from '../redux/postsSlice';
import api from '../api/api';

function PostPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();
    const postId = Number(id);

    const { user } = useContext(AuthContext);

    const posts = useSelector(state => state.posts.posts);

    const post = posts.find(post => {
        return post.id === postId;
    });

    const isAuthor = user && user.name === post?.author;

    async function handleDelete() {
        const isConfirmed = window.confirm(
            'Ти впевнений, що хочеш видалити цей пост?'
        );

        if (!isConfirmed) {
            return;
        }

        try {
            await api.delete(`/posts/${post.id}`);

            dispatch(removePost(post.id));
            navigate('/posts');
        } catch (error) {
            console.error('Помилка видалення поста:', error);
            alert('Не вдалося видалити пост. Спробуй ще раз.');
        }
    }

    const imageSrc = post?.imageUrl || post?.image;

    if (!post) {
        return <h1>Пост не знайдено</h1>;
    }

    return (
        <div className="post-page">
            <div className="post-meta">
                <span className="post-category">{post.category}</span>
            </div>

            <h1 className="post-title">{post.title}</h1>

            <div className="post-info">
                <p className="post-author">Автор: {post.author}</p>
                <p className="post-date">Дата: {post.date}</p>
            </div>

            {imageSrc && (
                <img
                    className="post-image"
                    src={imageSrc}
                    alt={post.title}
                />
            )}

            <div className="post-description">
                <p>{post.description}</p>
            </div>

            {isAuthor && (
                <div className="post-actions">
                    <Link
                        className="post-edit-button"
                        to={`/posts/${post.id}/edit`}
                    >
                        Редагувати
                    </Link>

                    <button
                        className="post-delete-button"
                        onClick={handleDelete}
                    >
                        Видалити пост
                    </button>
                </div>
            )}
        </div>
    );
}

export default PostPage;
