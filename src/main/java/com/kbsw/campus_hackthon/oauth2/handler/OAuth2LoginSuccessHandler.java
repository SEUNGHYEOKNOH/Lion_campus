package com.kbsw.campus_hackthon.oauth2.handler;

import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import com.kbsw.campus_hackthon.common.Role;
import com.kbsw.campus_hackthon.oauth2.CustomOAuth2User;
import com.kbsw.campus_hackthon.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserProfileRepository userProfileRepository;
    private final String FRONTEND_URL = "http://localhost:3000";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 Login 성공!");

        try {
            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

            // User의 Role이 GUEST일 경우 처음 요청한 회원이므로 회원가입 페이지로 리다이렉트
            if(oAuth2User.getRole() == Role.GUEST) {
                String accessToken = jwtUtil.generateAccessToken(oAuth2User.getEmail());
                
                // HttpOnly 쿠키로 토큰 설정 (보안 향상)
                setTokenCookie(response, "accessToken", accessToken, 15 * 60); // 15분
                
                response.addHeader(jwtUtil.getAccessHeader(), "Bearer " + accessToken);
                
                // 토큰 없이 안전하게 리다이렉트
                response.sendRedirect(FRONTEND_URL + "?status=guest");

                jwtUtil.sendAccessAndRefreshToken(response, accessToken, null);
            } else {
                // 로그인에 성공한 경우 access, refresh 토큰 생성
                String accessToken = jwtUtil.generateAccessToken(oAuth2User.getEmail());
                String refreshToken = jwtUtil.generateRefreshToken(oAuth2User.getEmail());
                
                // HttpOnly 쿠키로 토큰 설정 (보안 향상)
                setTokenCookie(response, "accessToken", accessToken, 15 * 60); // 15분
                setTokenCookie(response, "refreshToken", refreshToken, 7 * 24 * 60 * 60); // 7일
                
                response.addHeader(jwtUtil.getAccessHeader(), "Bearer " + accessToken);
                response.addHeader(jwtUtil.getRefreshHeader(), "Bearer " + refreshToken);
                
                jwtUtil.sendAccessAndRefreshToken(response, accessToken, refreshToken);
                jwtUtil.updateRefreshTokenOAuth2(oAuth2User.getEmail(), refreshToken);
                
                // 토큰 없이 안전하게 리다이렉트
                response.sendRedirect(FRONTEND_URL + "?status=success");
            }
        } catch (Exception e) {
            log.error("OAuth2 로그인 처리 중 오류 발생: {}", e.getMessage());
            response.sendRedirect(FRONTEND_URL + "/login?error=true");
        }
    }
    
    /**
     * HttpOnly 쿠키 설정 메서드 (보안 강화)
     * @param response HTTP 응답 객체
     * @param name 쿠키 이름
     * @param value 쿠키 값 (토큰)
     * @param maxAge 쿠키 만료 시간 (초)
     */
    private void setTokenCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);  // XSS 공격 방지
        cookie.setSecure(false);   // 개발환경(HTTP)에서는 false, 운영환경(HTTPS)에서는 true로 변경
        cookie.setPath("/");       // 모든 경로에서 접근 가능
        cookie.setMaxAge(maxAge);  // 쿠키 만료 시간 설정
        // cookie.setSameSite("Strict"); // CSRF 방지 (Servlet 5.0+에서 지원)
        
        response.addCookie(cookie);
        log.info("HttpOnly 쿠키 설정 완료: {}", name);
    }
}
