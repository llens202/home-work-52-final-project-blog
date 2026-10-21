
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-about">
                    <h2>DevBlog</h2>
                    <p>
                        Ідеї, код і досвід — в одному місці.
                    </p>
                </div>

                <nav className="footer-nav">
                    <Link to="/">Головна</Link>
                    <Link to="/posts">Пости</Link>
                    <Link to="/categories">Категорії</Link>
                </nav>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} DevBlog. Усі права захищені.</p>
            </div>
        </footer>
    );
}

export default Footer;
