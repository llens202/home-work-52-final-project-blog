
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updatePost } from '../redux/postsSlice';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/EditPostPage.css';

function EditPostPage() {
    const { id } = useParams();
    const postId = Number(id);

    const posts = useSelector(state => state.posts.posts);

    const post = posts.find(post => {
        return post.id === postId;
    });

    if (!post) {
        return <h1>Пост не знайдено</h1>;
    }

    return <EditPostForm post={post} />;
}

function EditPostForm({ post }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [author, setAuthor] = useState(post.author);
    const [category, setCategory] = useState(post.category);


    const [imageSrc, setImageSrc] = useState(post.imageUrl || post.image || '');
    const [imageUrlInput, setImageUrlInput] = useState('');

    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState('');


    async function handleSubmit(event) {
        event.preventDefault();

        try {

            let newImageUrl = imageUrlInput.trim() || imageSrc;

            if (imageFile) {
                const formData = new FormData();
                formData.append('images', imageFile);

                const response = await api.post('/upload-images', formData);

                newImageUrl = response.data.imagePaths[0];
            }

            const updatedPost = {
                ...post,
                title,
                description,
                author,
                category,
                imageUrl: newImageUrl,
            };

            const response = await api.patch(
                `/posts/${post.id}`,
                updatedPost
            );

            dispatch(updatePost(response.data));
            navigate(`/posts/${post.id}`);
        } catch (error) {
            console.error('Помилка редагування поста:', error);
            alert('Не вдалося завантажити фото або зберегти зміни.');
        }
    }


    return (
        <div className="edit-post-page">
            <form onSubmit={handleSubmit}>
                <h1>Редагування поста</h1>

                {imageSrc && (
                    <img
                        src={imageSrc.startsWith('/uploads/')
                            ? `http://localhost:3009${imageSrc}`
                            : imageSrc}
                        alt={post.title}
                    // width="250
                    />
                )}

                {imageSrc && (
                    <button
                        type="button"
                        onClick={() => setImageSrc('')}
                    >
                        Видалити фото
                    </button>
                )}

                <label>
                    Назва:
                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </label>
                <label>
                    Опис:
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </label>
                <label>
                    Автор:
                    <input
                        type="text"
                        value={author}
                        onChange={(event) => setAuthor(event.target.value)}
                    />
                </label>

                <label>
                    URL нового фото:
                    <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(event) => setImageUrlInput(event.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                </label>

                <label>
                    Або вибери фото з комп'ютера:

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                            const file = event.target.files[0];

                            if (!file) {
                                setImageFile(null);
                                setImageError('');
                                return;
                            }

                            if (!file.type.startsWith('image/')) {
                                setImageFile(null);
                                setImageError('Будь ласка, вибери файл зображення.');
                                event.target.value = '';
                                return;
                            }

                            setImageFile(file);
                            setImageError('');
                        }}
                    />

                </label>

                {imageError && (
                    <p className="image-error">{imageError}</p>
                )}

                <label>
                    Категорія:

                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option value="Програмування">Програмування</option>
                        <option value="Вебдизайн">Вебдизайн</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="React">React</option>
                        <option value="HTML/CSS">HTML/CSS</option>
                    </select>

                </label>
                <button type="submit">Зберегти зміни</button>

            </form>
        </div>
    );
}

export default EditPostPage;



