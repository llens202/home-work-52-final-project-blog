import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts } from './redux/postsSlice';
import Header from './components/Header'
import { Routes, Route } from 'react-router-dom'  
import HomePage from './pages/HomePage'
import PostsPage from './pages/PostsPage'
import CategoriesPage from './pages/CategoriesPage'
import RegisterPage from './pages/RegisterPage'
import PostPage from './pages/PostPage'
import CreatePostPage from './pages/CreatePostPage'

function App() {

const dispatch = useDispatch();

useEffect(() => {
  dispatch(fetchPosts());
}, [dispatch]);

  return (
    <>
    <Header />
  <main>
    <Routes>
     <Route path="/" element={<HomePage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/posts/create" element={<CreatePostPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/posts/:id" element={<PostPage />} />
    </Routes>
  </main>
    </>
  
  )
}

export default App