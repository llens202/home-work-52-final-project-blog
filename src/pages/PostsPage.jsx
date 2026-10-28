import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
// import posts from '../data/posts';
import '../styles/PostsPage.css';




function PostsPage() {


  const posts = useSelector(state => state.posts.posts);

  const loading = useSelector(state => state.posts.loading);
  const error = useSelector(state => state.posts.error);

  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category')

  const [category, setCategory] = useState(selectedCategory || 'Усі');
  const [currentPage, setCurrentPage] = useState(1);
  const postsHeadingRef = useRef(null);

  useEffect(() => {
    setCategory(selectedCategory || 'Усі');
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    postsHeadingRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [currentPage, category]);

  const filteredPosts = posts.filter(post => {
    return category === 'Усі' || post.category === category;
  });

  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="posts-page">



      <h1 ref={postsHeadingRef}>Сторінка постів DevBlog</h1>


      <select
        value={category}
        onChange={event => {
          setCategory(event.target.value);
          setCurrentPage(1);
        }}>
        <option>Усі</option>
        <option>Програмування</option>
        <option>Вебдизайн</option>
        <option>JavaScript</option>
        <option>React</option>
        <option>HTML/CSS</option>
      </select>

      {loading ? (
        <p>Завантаження постів...</p>
      ) : error ? (
        <p>Помилка завантаження постів: {error}</p>
      ) : (
        currentPosts.map(post => {
          return <PostCard key={post.id} post={post} />;
        })
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

    </div>

  )
}

export default PostsPage;

