import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const client = axios.create({
    baseURL: API,
    headers: {
        'Content-Type': 'application/json',
    },

});


// Post Endpoints
export const BlogAPI = {
    list: async (userId, page = 1, limit = 10) => {
        const params = { page, limit };
        if (userId) params.userId = userId;
        const response = await client.get('/api/blogs', { params });
        return response.data;
    },
    search: async (query) => {
        const response = await client.get('/api/blogs/search', { params: { q: query } });
        return response.data;
    },
    create: async (blogData) => {
        const response = await client.post('/api/blogs', blogData);
        return response.data;
    },
    update: async (id, blogData) => {
        const response = await client.put(`/api/blogs/${id}`, blogData);
        return response.data;

},
    remove: async (id) => {
        const response = await client.delete(`/api/blogs/${id}`);
        return response.data;
    },
    addComment: async (id, commentData) => {
        const response = await client.post(`/api/blogs/${id}/comments`, commentData);
        return response.data;
    },
};

