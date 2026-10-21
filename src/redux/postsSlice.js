
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const response = await api.get('/posts');
        return response.data;
    }
);

const initialState = {
    posts: [],
    loading: false,
    error: null
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,

    reducers: {
        addPost: (state, action) => {
            state.posts.push(action.payload);
        },

        updatePost: (state, action) => {
            const index = state.posts.findIndex(
                post => post.id === action.payload.id
            );

            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },

        removePost: (state, action) => {
            state.posts = state.posts.filter(
                post => post.id !== action.payload
            );
        }
    },

    extraReducers: (builder) => {
        builder.addCase(fetchPosts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false;
        });

        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export default postsSlice.reducer;

export const { addPost, updatePost, removePost } = postsSlice.actions;
