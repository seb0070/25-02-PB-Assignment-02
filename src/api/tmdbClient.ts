import axios from 'axios';

const tmdbClient = axios.create({
    baseURL: import.meta.env.VITE_TMDB_BASE_URL,
    params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'ko-KR',
    },
});

export default tmdbClient;
