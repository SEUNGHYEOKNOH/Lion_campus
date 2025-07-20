package com.kbsw.campus_hackthon.Service;

import com.kbsw.campus_hackthon.Dto.TokenResponseDto;
import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import com.kbsw.campus_hackthon.entity.UserProfile;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final JwtService jwtService;
    private final UserProfileRepository userProfileRepository;

    @Transactional
    public TokenResponseDto refreshTokens(HttpServletRequest request, HttpServletResponse response) {
        // 1. RefreshToken 추출
        Optional<String> refreshTokenOpt = jwtService.extractRefreshToken(request);
        if (refreshTokenOpt.isEmpty()) {
            throw new IllegalArgumentException("RefreshToken이 필요합니다.");
        }

        String refreshToken = refreshTokenOpt.get();

        // 2. 토큰 유효성 검증
        if (!jwtService.isTokenValid(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 RefreshToken입니다.");
        }

        // 3. 이메일 추출
        String email = jwtService.extractEmail(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("토큰에서 사용자 정보를 찾을 수 없습니다."));

        // 4. 사용자 확인 및 토큰 일치 검증
        UserProfile userProfile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!refreshToken.equals(userProfile.getRefreshToken())) {
            throw new IllegalArgumentException("토큰이 일치하지 않습니다.");
        }

        // 5. 새로운 토큰 발급
        String newAccessToken = jwtService.createAccessToken(email);
        String newRefreshToken = jwtService.createRefreshToken(email);

        // 6. RefreshToken 업데이트
        jwtService.updateRefreshToken(email, newRefreshToken);

        // 7. 응답 헤더 설정
        jwtService.sendAccessAndRefreshToken(response, newAccessToken, newRefreshToken);

        log.info("토큰 갱신 성공: {}", email);

        return TokenResponseDto.success(newAccessToken, newRefreshToken);
    }
}
