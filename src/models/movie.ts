// 장르 타입
export interface Genre {
    id: number;
    name: string;
}

// 기존 Movie 타입 (리스트용)
export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
}

// 상세 페이지 전용 타입
export interface MovieDetail extends Movie {
    genres: Genre[];
}
