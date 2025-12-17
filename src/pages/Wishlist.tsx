import { useWishlist } from '../hooks/useWishlist';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return <p>찜한 영화가 없습니다.</p>;
    }

    return (
        <div>
            <h2>내가 찜한 영화</h2>
            {wishlist.map((movie) => (
                <p key={movie.id}>{movie.title}</p>
            ))}
        </div>
    );
};

export default Wishlist;
