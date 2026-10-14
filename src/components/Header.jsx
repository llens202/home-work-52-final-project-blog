import { Link } from 'react-router-dom'
import '../styles/Header.css'



function Header() {
  return (
    <header className="header">
      <h1>DevBlog</h1>
      
    <nav>
        <Link className="nav-link" to="/" >
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
        <Link className="nav-link" to="/register">
          Register
        </Link>
    </nav>
      
    </header>
  )
}

export default Header;