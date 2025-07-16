import axios from "axios";

export const loginWithGoogle = async () => {
  const res = await axios.get("/api/user/tags/{userId}")
  return res.data
}


// /api/v1/oauth2/callback < - 사용자 정보 받아오기