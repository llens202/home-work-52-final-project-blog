import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addPost } from '../redux/postsSlice';
import api from '../api/api';
import '../styles/CreatePostForm.css';

function CreatePostForm() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('Програмування');
    const [image, setImage] = useState(null);

    const imageInputRef = useRef(null);

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            if (!title || !description || !author) {
                alert('Заповни всі поля');

                return;
            }

            let imageUrl = null;

            if (image) {
                const formData = new FormData();
                formData.append('images', image);

                const response = await api.post('/upload-images', formData);

                imageUrl = response.data.imagePaths[0];
            }

            const newPost = {
                id: Date.now(),
                title: title,
                description: description,
                author: author,
                category: category,
                imageUrl: imageUrl,
                date: '10.10.2026'
            }

            const response = await api.post('/posts', newPost);
            const savedPost = response.data;

            dispatch(addPost(savedPost));
            navigate(`/posts/${savedPost.id}`);


            setTitle('');
            setDescription('');
            setAuthor('');
            setCategory('Програмування');
            setImage(null);
            imageInputRef.current.value = '';

            console.log(newPost);
        } catch (error) {
            console.error('Помилка створення поста:', error);
            alert('Не вдалося створити пост. Спробуй ще раз.');
        }
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

            <label htmlFor="author">Автор поста</label>
            <input id="author"
                type="text"
                value={author}
                onChange={(event) => setAuthor(event.target.value)} />

            <label htmlFor='image'>Картинка поста</label>
            <input
                id="image"
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={(event) => setImage(event.target.files[0])}
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
                onChange={(event) => setCategory(event.target.value)}>
                <option value="Програмування">Програмування</option>
                <option value="Вебдизайн">Вебдизайн</option>
            </select>
            <button type="submit">Створити пост</button>


        </form>
    );
}

export default CreatePostForm;