import { useEffect, useState } from 'react';
import { getPopularMovies } from '../api/movies';
import type { Movie } from '../models/movie';
import { useWishlist } from '../hooks/useWishlist';

const Home = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const { toggleWishlist, isWished } = useWishlist();

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res = await getPopularMovies();
                setMovies(res.data.results);
            } catch (e) {
                console.error('TMDB API error', e);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) return <p>로딩 중...</p>;

    return (
        <div>
            <h2>인기 영화</h2>

            {movies.map((movie) => (
                <div key={movie.id} style={{ marginBottom: '8px' }}>
                    <span>{movie.title}</span>
                    <button
                        onClick={() =>
                            toggleWishlist({
                                id: movie.id,
                                title: movie.title,
                                poster_path: movie.poster_path,
                            })
                        }
                    >
                        {isWished(movie.id) ? '찜 해제' : '찜'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Home;
