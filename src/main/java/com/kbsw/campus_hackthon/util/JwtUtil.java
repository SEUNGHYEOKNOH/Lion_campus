package com.kbsw.campus_hackthon.util;

//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import com.kbsw.campus_hackthon.entity.UserProfile;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtUtil {

    private final Key key;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;
    private final UserProfileRepository userProfileRepository;

    // JWT 헤더 이름들
    private final String ACCESS_TOKEN_HEADER = "Authorization";
    private final String REFRESH_TOKEN_HEADER = "Authorization-refresh";

    // 설정 파일에서 JWT 관련 값들을 주입받는 생성자
    public JwtUtil(
            @Value("${jwt.secret-key}") String secretKey,
            @Value("${jwt.access.expiration}") long accessTokenExpiration,
            @Value("${jwt.refresh.expiration}") long refreshTokenExpiration,
            UserProfileRepository userProfileRepository
    ) {
        // Base64로 디코딩하여 Key 객체 생성
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Access Token 생성
     *
     * @param email 사용자 이메일
     * @return JWT Access Token
     */
    public String generateAccessToken(String email) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + this.accessTokenExpiration))
                .signWith(this.key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Refresh Token 생성
     *
     * @param email 사용자 이메일
     * @return JWT Refresh Token
     */
    public String generateRefreshToken(String email) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + this.refreshTokenExpiration))
                .signWith(this.key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Access Token 헤더 이름 반환
     *
     * @return Access Token 헤더 이름
     */
    public String getAccessHeader() {
        return ACCESS_TOKEN_HEADER;
    }

    /**
     * Refresh Token 헤더 이름 반환
     *
     * @return Refresh Token 헤더 이름
     */
    public String getRefreshHeader() {
        return REFRESH_TOKEN_HEADER;
    }

    /**
     * 응답에 Access Token과 Refresh Token 추가
     *
     * @param response HttpServletResponse
     * @param accessToken Access Token
     * @param refreshToken Refresh Token
     */
    public void sendAccessAndRefreshToken(HttpServletResponse response, String accessToken, String refreshToken) {
        response.setStatus(HttpServletResponse.SC_OK);
        
        if (accessToken != null) {
            response.addHeader(getAccessHeader(), "Bearer " + accessToken);
        }
        
        if (refreshToken != null) {
            response.addHeader(getRefreshHeader(), "Bearer " + refreshToken);
        }
    }

    /**
     * OAuth2 사용자의 Refresh Token 업데이트
     *
     * @param email 사용자 이메일
     * @param refreshToken 새로운 Refresh Token
     */
    public void updateRefreshTokenOAuth2(String email, String refreshToken) {
        UserProfile userProfile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 사용자를 찾을 수 없습니다: " + email));
        
        userProfile.updateRefreshToken(refreshToken);
        userProfileRepository.save(userProfile);
    }

    /**
     * JWT 토큰 유효성 검증
     *
     * @param token 검증할 JWT 토큰
     * @return 유효하면 true, 그렇지 않으면 false
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(this.key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException | SecurityException e) {
            System.out.println("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            System.out.println("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            System.out.println("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            System.out.println("JWT 클레임이 비어 있습니다.");
        }
        return false;
    }

    /**
     * JWT 토큰에서 이메일 추출
     *
     * @param token JWT 토큰
     * @return 사용자 이메일
     */
    public String getEmailFromToken(String token) {
        return this.parseClaims(token).getSubject();
    }

    /**
     * JWT 토큰 만료 시간 추출
     *
     * @param token JWT 토큰
     * @return 만료 시간
     */
    public Date getExpiration(String token) {
        return this.parseClaims(token).getExpiration();
    }

    /**
     * JWT 토큰에서 Claims 추출
     *
     * @param token JWT 토큰
     * @return Claims 객체
     */
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(this.key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
