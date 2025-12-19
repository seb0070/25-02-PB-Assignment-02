import tmdbClient from './tmdbClient';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/* =========================
   Movie Detail
========================= */
export const getMovieDetail = (movieId: number) => {
    return tmdbClient.get(`/movie/${movieId}`, {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
        },
    });
};

// 🎬 영화 예고편 조회
export const getMovieVideos = (movieId: number) => {
    return tmdbClient.get(`/movie/${movieId}/videos`, {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
        },
    });
};

/* =========================
   Movie Lists
========================= */

// 인기 영화
export const getPopularMovies = (page = 1) => {
    return tmdbClient.get('/movie/popular', {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
            page,
        },
    });
};

// 평점 높은 영화
export const getTopRatedMovies = (page = 1) => {
    return tmdbClient.get('/movie/top_rated', {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
            page,
        },
    });
};

// 현재 상영 중
export const getNowPlayingMovies = (page = 1) => {
    return tmdbClient.get('/movie/now_playing', {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
            page,
        },
    });
};

// 개봉 예정 영화
export const getUpcomingMovies = (page = 1) => {
    return tmdbClient.get('/movie/upcoming', {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
            page,
        },
    });
};

/* =========================
   🔥 Trending (중요)
========================= */

// 🔥 오늘의 트렌딩
export const getTrendingMoviesDay = (page = 1) => {
    return tmdbClient.get('/trending/movie/day', {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
            page,
        },
    });
};

// 🔥 이번 주 트렌딩
export const getTrendingMoviesWeek = (page = 1) => {
    return tmdbClient.get('/trending/movie/week', {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
            page,
        },
    });
};

/* =========================
   🔍 Search
========================= */

// 🔍 멀티 검색 (영화 + 인물 + TV)
export const searchMulti = (query: string, page = 1) => {
    return tmdbClient.get('/search/multi', {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
            query,
            page,
            include_adult: false,
        },
    });
};
