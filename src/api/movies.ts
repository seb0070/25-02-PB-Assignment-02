import tmdbClient from './tmdbClient';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const getMovieDetail = (movieId: number) => {
    return tmdbClient.get(`/movie/${movieId}`);
};

// 🎬 영화 예고편 조회
export const getMovieVideos = (movieId: number) => {
    return tmdbClient.get(`/movie/${movieId}/videos`);
};


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

export const getNowPlayingMovies = (page?: number) => {
    return tmdbClient.get('/movie/now_playing', {
        params: {
            api_key: API_KEY,
            language: ':ko-KR',
            page,
        }
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

// 🔥 오늘의 트렌딩 (Search / Popular / Home에서 공통 사용)
export const getTrendingMoviesDay = () => {
    return tmdbClient.get('/trending/movie/day', {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
        },
    });
};

// 🔥 이번 주 트렌딩
export const getTrendingMoviesWeek = () => {
    return tmdbClient.get('/trending/movie/week', {
        params: {
            api_key: API_KEY,
            language: 'ko-KR',
        },
    });
};

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
