/**
 * JWT 토큰 관리 유틸리티
 */

// LocalStorage 키
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * 액세스 토큰 저장
 * @param {string} token 액세스 토큰
 */
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

/**
 * 리프레시 토큰 저장
 * @param {string} token 리프레시 토큰
 */
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

/**
 * 액세스 토큰 조회
 * @returns {string|null} 액세스 토큰
 */
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * 리프레시 토큰 조회
 * @returns {string|null} 리프레시 토큰
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * 모든 토큰 제거 (로그아웃)
 */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * 로그인 상태 확인
 * @returns {boolean} 로그인 여부
 */
export const isLoggedIn = () => {
  return !!getAccessToken();
};

/**
 * 토큰 만료 시간 확인
 * @param {string} token JWT 토큰
 * @returns {boolean} 만료 여부
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('토큰 파싱 에러:', error);
    return true;
  }
};

/**
 * URL에서 토큰 추출 및 저장
 * OAuth 로그인 후 리다이렉트에서 사용
 */
export const extractAndSaveTokensFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('accessToken');
  const refreshToken = urlParams.get('refreshToken');

  if (accessToken) {
    setAccessToken(accessToken);
    console.log('액세스 토큰이 저장되었습니다.');
  }

  if (refreshToken) {
    setRefreshToken(refreshToken);
    console.log('리프레시 토큰이 저장되었습니다.');
  }

  // URL에서 토큰 파라미터 제거
  if (accessToken || refreshToken) {
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
    return true;
  }

  return false;
}; 