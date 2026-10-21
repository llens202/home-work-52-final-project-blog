
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function HomePage() {
    const posts = useSelector((state) => state.posts.posts);

    const categories = [...new Set(
        posts
            .map((post) => post.category)
            .filter(Boolean)
    )];

    return (
        <>
            <div className="hero">
                <p className="hero-label">
                    DEV BLOG · СВІТ ВЕБРОЗРОБКИ
                </p>

                <h1>
                    Ідеї, код і досвід — в одному місці.
                </h1>

                <p className="hero-description">
                    Практичні статті про JavaScript, React, вебдизайн
                    та технології, які допомагають створювати сучасні сайти.
                </p>

                <div className="hero-actions">
                    <Link className="hero-button" to="/posts">
                        Читати пости →
                    </Link>

                    <Link
                        className="hero-button hero-button-secondary"
                        to="/categories"
                    >
                        Переглянути категорії
                    </Link>
                </div>
            </div>

            <section className="popular-posts">
                <h2>Популярні пости</h2>

                <div className="popular-posts-list">
                    {posts.slice(0, 3).map((post) => (
                        <article
                            className="popular-post-card"
                            key={post.id}
                        >
                            {post.imageUrl && (
                                <Link to={`/posts/${post.id}`}>
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="popular-post-image"
                                    />
                                </Link>
                            )}

                            <h3>
                                <Link to={`/posts/${post.id}`}>
                                    {post.title}
                                </Link>
                            </h3>

                            <p>{post.description}</p>

                            <p>Автор: {post.author}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="home-categories">
                <h2>Досліджуй за категоріями</h2>

                <p className="home-categories-description">
                    Обирай тему, яка тебе цікавить, і знаходь корисні матеріали.
                </p>

                <div className="home-categories-list">
                    {categories.map((category) => (
                        <Link
                            className="home-category-link"
                            to={`/posts?category=${encodeURIComponent(category)}`}
                            key={category}
                        >
                            {category}
                            <span> →</span>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <p>Категорії з'являться після додавання постів.</p>
                )}

                <Link className="home-categories-all" to="/categories">
                    Усі категорії →
                </Link>
            </section>
        </>
    );
}

export default HomePage;
