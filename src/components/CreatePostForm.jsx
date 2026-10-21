import { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addPost } from '../redux/postsSlice';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import '../styles/CreatePostForm.css';

function CreatePostForm() {
    const { user } = useContext(AuthContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Програмування');
    const [image, setImage] = useState(null);
    const [imageUrlInput, setImageUrlInput] = useState('');

    const imageInputRef = useRef(null);

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            if (!title || !description) {
                alert('Заповни всі поля');

                return;
            }


            let imageUrl = null;

            if (imageUrlInput.trim()) {
                imageUrl = imageUrlInput.trim();
            } else if (image) {
                const formData = new FormData();
                formData.append('images', image);

                const token = localStorage.getItem('token');

                const response = await api.post('/upload-images', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                imageUrl = response.data.imagePaths[0];
            }


            const newPost = {
                id: Date.now(),
                title: title,
                description: description,
                category: category,
                imageUrl: imageUrl,
                date: new Date().toLocaleDateString('uk-UA')
            }

            const token = localStorage.getItem('token');

            const response = await api.post('/posts', newPost, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const savedPost = response.data;

            dispatch(addPost(savedPost));
            navigate(`/posts/${savedPost.id}`);


            setTitle('');
            setDescription('');
            setCategory('Програмування');
            setImage(null);
            setImageUrlInput('');
            imageInputRef.current.value = '';

            console.log(newPost);
        } catch (error) {
            console.error('Помилка створення поста:', error);
            alert('Не вдалося створити пост. Спробуй ще раз.');
        }
    }

    if (!user) {
        return (
            <div className="auth-required">
                <h2>Потрібна авторизація</h2>
                <p>Щоб створити пост, увійдіть у свій акаунт або зареєструйтеся.</p>
                <Link to="/register">Зареєструватися</Link>
            </div>
        );
    }


    return (
        <form className="create-post-form" onSubmit={handleSubmit}>
            <label htmlFor="title">Назва поста</label>
            <input id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)} />

            <label htmlFor="description">Опис поста</label>
            <textarea id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}></textarea>

            <label htmlFor='image'>Картинка поста</label>
            <input
                id="image"
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={(event) => setImage(event.target.files[0])}
            />

            <label htmlFor="imageUrlInput">Або встав URL картинки:</label>
            <input
                id="imageUrlInput"
                type="url"
                value={imageUrlInput}
                onChange={(event) => setImageUrlInput(event.target.value)}
                placeholder="https://example.com/image.jpg"
            />

            {image && (
                <div className="image-preview">
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Попередній перегляд"
                    />
                </div>
            )}

            <label htmlFor="category">Категорія</label>

            <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
            >
                <option value="Програмування">Програмування</option>
                <option value="Вебдизайн">Вебдизайн</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="HTML/CSS">HTML/CSS</option>
            </select>

            <button type="submit">Створити пост</button>


        </form>
    );
}

export default CreatePostForm;