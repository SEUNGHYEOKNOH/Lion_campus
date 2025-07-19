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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

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
                response.addHeader(jwtUtil.getAccessHeader(), "Bearer " + accessToken);

                // 토큰을 URL 파라미터로 전달
                String redirectUrl = FRONTEND_URL + "?accessToken=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
                response.sendRedirect(redirectUrl);

                jwtUtil.sendAccessAndRefreshToken(response, accessToken, null);
            } else {
                // 로그인에 성공한 경우 access, refresh 토큰 생성
                String accessToken = jwtUtil.generateAccessToken(oAuth2User.getEmail());
                String refreshToken = jwtUtil.generateRefreshToken(oAuth2User.getEmail());

                response.addHeader(jwtUtil.getAccessHeader(), "Bearer " + accessToken);
                response.addHeader(jwtUtil.getRefreshHeader(), "Bearer " + refreshToken);

                // 토큰을 URL 파라미터로 전달
                String redirectUrl = FRONTEND_URL +
                        "?accessToken=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8) +
                        "&refreshToken=" + URLEncoder.encode(refreshToken, StandardCharsets.UTF_8);

                jwtUtil.sendAccessAndRefreshToken(response, accessToken, refreshToken);
                jwtUtil.updateRefreshTokenOAuth2(oAuth2User.getEmail(), refreshToken);

                response.sendRedirect(redirectUrl);
            }
        } catch (Exception e) {
            log.error("OAuth2 로그인 처리 중 오류 발생: {}", e.getMessage());
            response.sendRedirect(FRONTEND_URL + "/login?error=true");
        }
    }
}
