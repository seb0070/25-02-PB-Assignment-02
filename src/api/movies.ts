import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const client = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'ko-KR',
    },
});

/* =========================
   공통 Movie API
========================= */

export const getPopularMovies = (page = 1) =>
    client.get('/movie/popular', { params: { page } });

export const getTopRatedMovies = (page = 1) =>
    client.get('/movie/top_rated', { params: { page } });

export const getTrendingMoviesDay = () =>
    client.get('/trending/movie/day');

export const getTrendingMoviesWeek = (page = 1) =>
    client.get('/trending/movie/week', { params: { page } });

/* =========================
   🔍 Search 전용 API
========================= */

/**
 * Multi Search
 * - movie
 * - tv
 * - person
 */
export const searchMulti = (query: string, page = 1) =>
    client.get('/search/multi', {
        params: {
            query,
            page,
            include_adult: false,
        },
    });
