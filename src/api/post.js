// src/api/post.js
import axios from 'axios';

const BASE_URL ='http://localhost:8080';

export const fetchPostsByTag = async (tagName) => {
    try {
      const url = `${BASE_URL}/api/posts/tag/${tagName}`;
      console.log("🔗 요청 URL:", url); // URL 로그 찍기
      const res = await axios.get(url);
      console.log("📥 응답 데이터:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ fetchPostsByTag 실패:", error.response || error);
      return [];
    }
  };

  export const fetchPostDetail = async (postId) => {
    try {
      const url = `${BASE_URL}/api/posts/${postId}`;
      console.log("🔗 요청 URL:", url); // URL 로그 찍기
      const res = await axios.get(url);
      console.log("📥 응답 데이터:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ fetchPostDetail 실패:", error.response || error);
      return null; // 실패 시 null 반환
    }
  }