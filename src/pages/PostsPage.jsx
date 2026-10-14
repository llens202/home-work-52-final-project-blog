import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
// import posts from '../data/posts';
import '../styles/PostsPage.css';




function PostsPage() {

  const posts = useSelector(state => state.posts.posts);

  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category')

  const [category, setCategory] = useState(selectedCategory ||'Усі');

  useEffect(() => {
    setCategory(selectedCategory || 'Усі')
  },[selectedCategory])

    const filteredPosts = posts.filter(post => {
        return category === 'Усі' || post.category === category;
    });


     return (
      <div className="posts-page">

      

          <h1>Сторінка постів DevBlog</h1>


          <select 
          value={category}
          onChange={event => {
            setCategory(event.target.value);
          }}>
            <option>Усі</option>
            <option>Програмування</option>
            <option>Вебдизайн</option>
          </select>

      {filteredPosts.map(post => {
        return <PostCard key={post.id} post={post} />;
      })}

      </div>
       
     )
}

export default PostsPage;

