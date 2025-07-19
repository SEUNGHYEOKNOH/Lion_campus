import { getAccessToken, getRefreshToken, clearTokens, setAccessToken, setRefreshToken } from './auth.js';

/**
 * API 기본 설정
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * HTTP 요청을 보내는 기본 함수
 * @param {string} url 요청 URL
 * @param {object} options 요청 옵션
 * @returns {Promise<Response>} 응답 객체
 */
const request = async (url, options = {}) => {
  const accessToken = getAccessToken();
  
  // 기본 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 액세스 토큰이 있으면 Authorization 헤더 추가
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    let response = await fetch(`${BASE_URL}${url}`, config);

    // 401 에러가 발생하면 토큰 갱신 시도
    if (response.status === 401 && accessToken) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        // 리프레시 토큰으로 새 액세스 토큰 요청
        const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization-refresh': `Bearer ${refreshToken}`,
          },
        });

        if (refreshResponse.ok) {
          // 새 토큰 저장
          const newAccessToken = refreshResponse.headers.get('Authorization')?.replace('Bearer ', '');
          const newRefreshToken = refreshResponse.headers.get('Authorization-refresh')?.replace('Bearer ', '');
          
          if (newAccessToken) {
            setAccessToken(newAccessToken);
          }
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }

          // 원래 요청을 새 토큰으로 재시도
          headers.Authorization = `Bearer ${newAccessToken}`;
          response = await fetch(`${BASE_URL}${url}`, { ...config, headers });
        } else {
          // 리프레시 토큰도 만료된 경우 로그아웃
          clearTokens();
          window.location.href = '/login';
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
      } else {
        clearTokens();
        window.location.href = '/login';
        throw new Error('인증이 필요합니다.');
      }
    }

    return response;
  } catch (error) {
    console.error('API 요청 에러:', error);
    throw error;
  }
};

/**
 * GET 요청
 * @param {string} url 요청 URL
 * @returns {Promise<any>} 응답 데이터
 */
export const get = async (url) => {
  const response = await request(url, { method: 'GET' });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * POST 요청
 * @param {string} url 요청 URL
 * @param {object} data 요청 데이터
 * @returns {Promise<any>} 응답 데이터
 */
export const post = async (url, data) => {
  const response = await request(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * PUT 요청
 * @param {string} url 요청 URL
 * @param {object} data 요청 데이터
 * @returns {Promise<any>} 응답 데이터
 */
export const put = async (url, data) => {
  const response = await request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * DELETE 요청
 * @param {string} url 요청 URL
 * @returns {Promise<any>} 응답 데이터
 */
export const del = async (url) => {
  const response = await request(url, { method: 'DELETE' });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // DELETE 요청은 보통 빈 응답을 반환
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

/**
 * 사용자 API
 */
export const userAPI = {
  // 현재 사용자 정보 조회
  getCurrentUser: () => get('/api/user/me'),
  
  // 사용자 정보 수정
  updateUser: (userData) => put('/api/user/me', userData),
  
  // 회원 탈퇴
  deleteUser: () => del('/api/user/me'),
};

export default {
  get,
  post,
  put,
  del,
  userAPI,
}; 