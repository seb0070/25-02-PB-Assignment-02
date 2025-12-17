import tmdbClient from './tmdbClient';

export const getPopularMovies = (page = 1) =>
    tmdbClient.get('/movie/popular', {
        params: { page },
    });

export const getNowPlayingMovies = (page = 1) =>
    tmdbClient.get('/movie/now_playing', {
        params: { page },
    });

export const searchMovies = (query: string, page = 1) =>
    tmdbClient.get('/search/movie', {
        params: { query, page },
    });

export const discoverMovies = (genreId?: number, page = 1) =>
    tmdbClient.get('/discover/movie', {
        params: {
            with_genres: genreId,
            page,
        },
    });
