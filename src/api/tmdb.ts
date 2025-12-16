import axios from 'axios';

/**
 * 환경변수
 * - Vite에서는 반드시 VITE_ 접두사 사용
 */
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

/**
 * TMDB 공통 axios 인스턴스
 * - baseURL, api_key, language를 여기서 고정
 */
export const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'ko-KR',
    },
});

/**
 * 공통 에러 핸들링 (선택이지만 틀 단계에서 넣어두면 좋음)
 */
tmdb.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[TMDB API ERROR]', error.response || error.message);
        return Promise.reject(error);
    }
);

/**
 * 이미지 URL 생성 헬퍼
 * @param path poster_path 또는 backdrop_path
 * @param size w200 | w500 | original
 */
export const getImageUrl = (
    path: string,
    size: string = 'w500'
): string => {
    if (!path) return '';
    return `${IMAGE_BASE_URL}/${size}${path}`;
};
