import { useEffect, useState } from 'react';
import {
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
} from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';
import './Home.css';
import HeroBanner from '../components/HeroBanner';


const Home = () => {
    const [popular, setPopular] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [upcoming, setUpcoming] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchAll = async (): Promise<void> => {
            try {
                const [p, t, u] = await Promise.all([
                    getPopularMovies(1),
                    getTopRatedMovies(1),
                    getUpcomingMovies(1),
                ]);

                setPopular(p.data.results);
                setTopRated(t.data.results);
                setUpcoming(u.data.results);
            } catch (e) {
                console.error(e);
            }
        };

        fetchAll();
    }, []);

    return (
        <>
            <HeroBanner />
            {/* 인기 영화 */}
            <section className="row">
                <h2>인기 영화</h2>
                <div className="row-slider">
                    {popular.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>

            {/* 평점 높은 영화 */}
            <section className="row">
                <h2>평점 높은 영화</h2>
                <div className="row-slider">
                    {topRated.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>

            {/* 개봉 예정 */}
            <section className="row">
                <h2>개봉 예정작</h2>
                <div className="row-slider">
                    {upcoming.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>
        </>
    );
};

export default Home;
