import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {

  const [error, setError] = useState('');
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const { user, setUser } = useContext(AuthContext);

  async function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setUser(response.data.user);


    } catch (error) {
      setError(
        error.response?.data?.message || 'Не вдалося увійти'
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
  }

  return (
   
<header className="header">
  <h1 className="header-logo">
    DevBlog<span>.</span>
  </h1>

  <nav>
    <Link className="nav-link" to="/">
      Home
    </Link>

    <Link className="nav-link" to="/posts">
      Posts
    </Link>

    <Link className="nav-link" to="/posts/create">
      Create Post
    </Link>

    <Link className="nav-link" to="/categories">
      Categories
    </Link>
  </nav>

  <div className="header-auth">
    <div className="header-actions">
      <button
        type="button"
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={
          theme === 'light'
            ? 'Увімкнути темну тему'
            : 'Увімкнути світлу тему'
        }
        title={theme === 'light' ? 'Темна тема' : 'Світла тема'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>

    <div className="header-auth-content">
      {user ? (
        <div className="header-user">
          <span>Вітаємо, {user.name}!</span>
          <button type="button" onClick={handleLogout}>
            Вийти
          </button>
        </div>
      ) : (
        <>
          <form className="header-login" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              aria-label="Email"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Пароль"
              aria-label="Пароль"
              required
            />

            <button type="submit">Увійти</button>
          </form>

          <p className="header-register">
            Не маєте акаунта?{' '}
            <Link to="/register">Зареєструватися</Link>
          </p>

          {error && <p className="register-error">{error}</p>}
        </>
      )}
    </div>
  </div>
</header>

  );
}

export default Header;
