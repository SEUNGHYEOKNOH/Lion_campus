// import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const loginWithGoogle = () => {
  window.location.href = `${BASE_URL}/api/v1/oauth2/google/login`;
};



// export const userProfile= async() => {
//   const res = await axios.get(`${BASE_URL}/api/recommend/user/${userId}`);
//   const recommendations = res.data;

// }

//   const res = await axios.get("/api/user/tags/{userId}")
//   return res.data

// /api/v1/oauth2/callback < - 사용자 정보 받아오기
