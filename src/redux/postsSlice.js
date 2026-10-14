import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import posts from '../data/posts';
import api from '../api/api';


export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const response = await api.get('/posts');
        return response.data;
    }
);


const initialState = {
    posts: posts
};


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.posts.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            //  console.log('Публікації з сервера:', action.payload);
            state.posts = action.payload;

        });
    }
});


export default postsSlice.reducer;
export const { addPost } = postsSlice.actions;