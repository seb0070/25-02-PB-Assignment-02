import { useWishlist } from '../hooks/useWishlist';
import MovieCard from '../components/MovieCard';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return <p>찜한 영화가 없습니다.</p>;
    }

    return (
        <div>
            <h2>내가 찜한 영화</h2>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {wishlist.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={{
                            ...movie,
                            overview: '',
                            backdrop_path: '',
                            vote_average: 0,
                            release_date: '',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
