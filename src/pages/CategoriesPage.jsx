import '../styles/CategoriesPage.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'



function CategoriesPage() {

    const posts = useSelector(state => state.posts.posts);

    const categories = [...new Set(posts.map(post => {
      return post.category
}))];



        return (
        <div className="container categories-page"> 
            <h1>Категорії DevBlog</h1>
            <p>Обирай категорію, щоб переглянути пости на цікаві тобі теми.</p>
                <ul>
                    {categories.map(category => {
            return <li key={category}>
                        <Link 
                        className="category-link"
                        to={`/posts?category=${category}`}>
                            <span>{category}</span>
                            <span className="category-count">
                                {posts.filter(post => post.category === category).length} постів
                            </span>
                        </Link>
                    </li>;
                    })}
                </ul>
        </div>   
           
        )
}

export default CategoriesPage;