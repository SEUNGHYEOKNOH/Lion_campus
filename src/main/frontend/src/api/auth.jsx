// import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const loginWithGoogle = (provider) => {
  window.location.href = `${BASE_URL}/oauth2/authorization/${provider}`;
};
