import { useWishlist } from '../hooks/useWishlist';
import MovieCard from '../components/MovieCard';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <section className="wishlist wishlist--empty">
                <div className="wishlist__emptyCard">
                    <h2 className="wishlist__title">Wishlist</h2>
                    <p className="wishlist__subtitle">
                        아직 찜한 콘텐츠가 없습니다.<br />
                        마음에 드는 작품을 ❤️로 저장해보세요.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="wishlist">
            {/* 🔥 Popular와 동일한 헤더 구조 */}
            <header className="wishlist__sectionHeader">
                <h2 className="wishlist__title">❤️Wishlist</h2>
                <p className="wishlist__subtitle">
                    내가 저장한 콘텐츠를 한 번에 모아볼 수 있어요.
                </p>
            </header>

            <div className="wishlist__grid">
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
        </section>
    );
};

export default Wishlist;
