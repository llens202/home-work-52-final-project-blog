import '../styles/RegisterPage.css';
import { useState } from 'react';



function RegisterPage() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        setSuccess('');

        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            setError('Паролі не збігаються');

            return;
        } if (password.length < 8) {
            setError('Пароль повинен містити щонайменше 8 символів');
            return;
        }

        setError('');
        event.target.reset();
        setSuccess('Форму успішно заповнено!');
    }

    return (

        <div className="register-page">

            <h1>Реєстрація на DevBlog</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Ім'я</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Введіть ваше ім'я"
                    required
                />
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Введіть ваш email"
                    required
                />
                <label htmlFor="birthDate">Дата народження</label>
                <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                />
                <label htmlFor="password">Пароль</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Введіть пароль"
                    required
                />
                <label htmlFor="confirmPassword">Підтвердження пароля</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Повторіть пароль"
                    required
                />
                {error && <p className="register-error">{error}</p>}
                {success && <p className="register-success">  ✓ {success}</p>}
                <button type="submit">Зареєструватися</button>
            </form>
        </div>

    )
}

export default RegisterPage;