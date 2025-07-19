package com.kbsw.campus_hackthon.Service;

import com.kbsw.campus_hackthon.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * JWT 서비스 클래스
 * JWT 토큰 추출, 생성, 검증 등의 기능을 제공
 * 기존 JwtUtil의 기능을 확장하여 필터에서 사용할 메서드들 추가
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {

    private final JwtUtil jwtUtil;

    /**
     * HTTP 요청 헤더에서 AccessToken 추출
     * Bearer 토큰 형식에서 실제 토큰 부분만 추출
     *
     * @param request HTTP 요청
     * @return Optional<String> AccessToken 또는 Optional.empty()
     */
    public Optional<String> extractAccessToken(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(jwtUtil.getAccessHeader()))
                .filter(token -> token.startsWith("Bearer "))
                .map(token -> token.replace("Bearer ", ""));
    }

    /**
     * HTTP 요청 헤더에서 RefreshToken 추출
     * Bearer 토큰 형식에서 실제 토큰 부분만 추출
     *
     * @param request HTTP 요청
     * @return Optional<String> RefreshToken 또는 Optional.empty()
     */
    public Optional<String> extractRefreshToken(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(jwtUtil.getRefreshHeader()))
                .filter(token -> token.startsWith("Bearer "))
                .map(token -> token.replace("Bearer ", ""));
    }

    /**
     * AccessToken에서 이메일 추출
     *
     * @param accessToken AccessToken
     * @return Optional<String> 이메일 또는 Optional.empty()
     */
    public Optional<String> extractEmail(String accessToken) {
        try {
            return Optional.ofNullable(jwtUtil.getEmailFromToken(accessToken));
        } catch (Exception e) {
            log.error("AccessToken에서 이메일 추출 실패: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * AccessToken 생성
     *
     * @param email 사용자 이메일
     * @return AccessToken
     */
    public String createAccessToken(String email) {
        return jwtUtil.generateAccessToken(email);
    }

    /**
     * RefreshToken 생성
     *
     * @param email 사용자 이메일
     * @return RefreshToken
     */
    public String createRefreshToken(String email) {
        return jwtUtil.generateRefreshToken(email);
    }

    /**
     * RefreshToken 생성 (UserProfile 기반)
     * RTR(Refresh Token Rotation) 방식에서 사용
     *
     * @param userProfile 사용자 프로필
     * @return RefreshToken
     */
    public String createRefreshToken(com.kbsw.campus_hackthon.entity.UserProfile userProfile) {
        return jwtUtil.generateRefreshToken(userProfile.getEmail());
    }

    /**
     * 토큰 유효성 검증
     *
     * @param token 검증할 토큰
     * @return boolean 유효하면 true, 그렇지 않으면 false
     */
    public boolean isTokenValid(String token) {
        return jwtUtil.validateToken(token);
    }

    /**
     * 응답 헤더에 AccessToken과 RefreshToken 설정
     *
     * @param response     HTTP 응답
     * @param accessToken  AccessToken
     * @param refreshToken RefreshToken
     */
    public void sendAccessAndRefreshToken(HttpServletResponse response, String accessToken, String refreshToken) {
        jwtUtil.sendAccessAndRefreshToken(response, accessToken, refreshToken);
    }

    /**
     * 응답 헤더에 AccessToken만 설정
     *
     * @param response    HTTP 응답
     * @param accessToken AccessToken
     */
    public void sendAccessToken(HttpServletResponse response, String accessToken) {
        jwtUtil.sendAccessAndRefreshToken(response, accessToken, null);
    }

    /**
     * OAuth2 사용자의 RefreshToken 업데이트
     *
     * @param email        사용자 이메일
     * @param refreshToken 새로운 RefreshToken
     */
    public void updateRefreshToken(String email, String refreshToken) {
        jwtUtil.updateRefreshTokenOAuth2(email, refreshToken);
    }
} 