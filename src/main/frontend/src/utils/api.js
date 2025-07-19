import {
  getAccessToken,
  getRefreshToken,
  clearTokens,
  setAccessToken,
  setRefreshToken
} from './auth.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * 공통 요청 함수
 */
const request = async (url, options = {}) => {
  let accessToken = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  let config = {
    ...options,
    headers,
  };

  let response = await fetch(`${BASE_URL}${url}`, config);

  // 401 → 액세스 토큰 만료 → refresh로 재발급 시도
  if (response.status === 401 && accessToken) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization-refresh': `Bearer ${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        const newAccessToken = refreshRes.headers.get('Authorization')?.replace('Bearer ', '');
        const newRefreshToken = refreshRes.headers.get('Authorization-refresh')?.replace('Bearer ', '');

        if (newAccessToken) setAccessToken(newAccessToken);
        if (newRefreshToken) setRefreshToken(newRefreshToken);

        // 재시도
        headers.Authorization = `Bearer ${newAccessToken}`;
        config = { ...config, headers };
        response = await fetch(`${BASE_URL}${url}`, config);
      } else {
        clearTokens();
        window.location.href = '/login';
        throw new Error("리프레시 토큰도 만료되어 로그아웃 처리됨");
      }
    } else {
      clearTokens();
      window.location.href = '/login';
      throw new Error("인증 정보 없음. 로그인 필요");
    }
  }

  return response;
};

/**
 * GET
 */
export const get = async (url) => {
  const res = await request(url, { method: 'GET' });

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || !contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`응답 오류 ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
};

/**
 * POST
 */
export const post = async (url, data) => {
  const res = await request(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`POST 요청 실패: ${res.status}`);
  return res.json();
};

/**
 * PUT
 */
export const put = async (url, data) => {
  const res = await request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`PUT 요청 실패: ${res.status}`);
  return res.json();
};

/**
 * DELETE
 */
export const del = async (url) => {
  const res = await request(url, { method: 'DELETE' });

  if (!res.ok) throw new Error(`DELETE 요청 실패: ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

/**
 * 사용자 API
 */
export const userAPI = {
  getCurrentUser: () => get('/api/user/me'),
  updateUser: (data) => put('/api/user/me', data),
  deleteUser: () => del('/api/user/me'),
};

export default {
  get,
  post,
  put,
  del,
  userAPI,
};