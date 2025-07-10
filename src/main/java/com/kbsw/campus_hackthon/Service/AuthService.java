package com.kbsw.campus_hackthon.Service;

import com.kbsw.campus_hackthon.entity.UserProfile;
import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import com.kbsw.campus_hackthon.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final JwtUtil jwtUtil;
    private final UserProfileRepository userProfileRepository;

    public AuthService(JwtUtil jwtUtil, UserProfileRepository userProfileRepository) {
        this.jwtUtil = jwtUtil;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * 사용자 이메일 기반으로 JWT 토큰을 생성하고, 리프레시 토큰은 DB에 저장합니다.
     *
     * @param email 사용자 이메일
     * @return accessToken, refreshToken 포함된 응답
     */
    public ResponseEntity<Map<String, String>> authenticate(String email) {
        UserProfile user = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        String accessToken = jwtUtil.generateAccessToken(email);
        String refreshToken = jwtUtil.generateRefreshToken(email);

        user.setRefreshToken(refreshToken);
        userProfileRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken
        ));
    }
}