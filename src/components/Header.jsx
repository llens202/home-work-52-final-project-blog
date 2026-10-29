import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Header.css';

function Header() {

  const { t, i18n } = useTranslation();

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <button
        type="button"
        className="menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>
      <Link to="/" className="header-logo">
        DevBlog<span>.</span>
      </Link>

      <div className={`header-menu ${isMenuOpen ? 'is-open' : ''}`}>


        <nav>
          <Link className="nav-link" to="/">
            {t('nav.home')}
          </Link>

          <Link className="nav-link" to="/posts">
            {t('nav.posts')}
          </Link>

          <Link className="nav-link" to="/posts/create">
            {t('nav.createPost')}
          </Link>

          <Link className="nav-link" to="/categories">
            {t('nav.categories')}
          </Link>
        </nav>

        <div className="header-auth">
          <div className="header-actions">

            <div className="language-switcher">
          <button
            type="button"
            onClick={() => {
              i18n.changeLanguage('uk');
              localStorage.setItem('language', 'uk');
            }}
            disabled={i18n.language === 'uk'}
          >
            UA
          </button>

          <button
            type="button"
            onClick={() => {
              i18n.changeLanguage('en');
              localStorage.setItem('language', 'en');
            }}
            disabled={i18n.language === 'en'}
          >
            EN
          </button>
        </div>

            
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
                <h3 className="mobile-login-title">Вхід в акаунт</h3>
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
      </div>
    </header>

  );
}

export default Header;
