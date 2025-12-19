import { useEffect, useState } from 'react';
import type { AxiosResponse } from 'axios';
import type { Movie } from '../models/movie';
import MovieCard from './MovieCard';
import './MovieRow.css';

type Fetcher = (page?: number) => Promise<AxiosResponse<{ results: Movie[] }>>;

type Props = {
    title: string;
    fetcher: Fetcher;
    page?: number;
};

export default function MovieRow({ title, fetcher, page = 1 }: Props) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
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

        void run();
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
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>
        </section>
    );
}
