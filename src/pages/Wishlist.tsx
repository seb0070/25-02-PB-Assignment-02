import { useWishlist } from '../hooks/useWishlist';
import MovieCard from '../components/MovieCard';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    return (
        <section className="wishlist">
            {/* ✅ 항상 고정되는 헤더 */}
            <header className="wishlist__sectionHeader">
                <h2 className="wishlist__title">Wishlist</h2>
                <p className="wishlist__subtitle">
                    내가 저장한 콘텐츠를 한 번에 모아볼 수 있어요.
                </p>
            </header>

            {/* ✅ 콘텐츠 영역 */}
            {wishlist.length === 0 ? (
                <div className="wishlist__empty">
                    <div className="wishlist__emptyCard">
                        <p className="empty-title">
                            아직 찜한 콘텐츠가 없어요
                        </p>
                        <p className="empty-desc">
                            마음에 드는 작품을 <span>❤️</span>로 저장해보세요.
                        </p>
                    </div>
                </div>
            ) : (
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
            )}
        </section>
    );
};

export default Wishlist;
