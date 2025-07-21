import { get } from '../utils/api.js';

export const searchAPI = {
    // 통합 검색
    search: (keyword) => get(`/api/search?keyword=${encodeURIComponent(keyword)}`),

    // 태그만 검색
    searchTags: (keyword) => get(`/api/search/tags?keyword=${encodeURIComponent(keyword)}`),

    // 인기 태그
    getPopularTags: (limit = 10) => get(`/api/search/popular-tags?limit=${limit}`)
};