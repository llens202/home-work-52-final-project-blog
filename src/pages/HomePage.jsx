import '../styles/HomePage.css'
import { Link } from 'react-router-dom'

function HomePage() {


    return (
    <div className="hero">

        <h1>Головна сторінка DevBlog</h1>
        <p>Блог про веброзробку, JavaScript, React та сучасні технології.</p>
        <Link className="hero-button" to="/posts">Переглянути пости</Link>
        

    </div>
        
    )
}

export default HomePage;