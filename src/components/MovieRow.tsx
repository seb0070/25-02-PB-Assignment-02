import { useEffect, useState } from 'react';
import type { Movie } from '../models/movie';
import MovieCard from './MovieCard';
import './MovieRow.css';

/** TMDB 리스트 응답 최소 타입 */
type MovieListResponse = {
    data: {
        results: Movie[];
    };
};

type Fetcher = (page?: number) => Promise<MovieListResponse>;

type Props = {
    title: string;
    fetcher: Fetcher;
    onInfo?: (movie: Movie) => void;
    /** 홈에서는 1페이지만 보여주면 충분 */
    page?: number;
};

export default function MovieRow({
                                     title,
                                     fetcher,
                                     onInfo,
                                     page = 1,
                                 }: Props) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await fetcher(page);
                setMovies(res.data.results ?? []);
            } catch (e) {
                console.error('MovieRow TMDB error', e);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [fetcher, page]);

    return (
        <section className="row">
            <div className="row-head">
                <h2 className="row-title">{title}</h2>
                {loading && (
                    <span className="row-loading">
            <i className="fa-solid fa-spinner fa-spin" /> 불러오는 중
          </span>
                )}
            </div>

            <div className="row-slider" role="list">
                {movies.map((movie) => (
                    <div key={movie.id} role="listitem" className="row-item">
                        <MovieCard movie={movie} onInfo={onInfo} />
                    </div>
                ))}
            </div>
        </section>
    );
}
