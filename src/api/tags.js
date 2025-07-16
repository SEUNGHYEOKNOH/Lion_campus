import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserTags = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/tags/${userId}`);
    return response.data;
  } catch (error) {
    console.error('태그 불러오기 실패:', error);
    return [];
  }
};

export const fetchAllTags = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/tags`);
      console.log("전체 태그 응답:", response.data); // 👉 여기를 확인
      return response.data;
    } catch (error) {
      console.error("모든 태그 불러오기 실패:", error);
      return []; // 오류 시 빈 배열 반환
    }
  };