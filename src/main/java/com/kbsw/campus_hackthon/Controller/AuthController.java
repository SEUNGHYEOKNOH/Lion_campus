package com.kbsw.campus_hackthon.Controller;

import com.kbsw.campus_hackthon.Dto.TokenResponseDto;
import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import com.kbsw.campus_hackthon.Service.AuthService;
import com.kbsw.campus_hackthon.Service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "인증 관련 API")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/refresh")
    @Operation(summary = "토큰 갱신", description = "RefreshToken을 사용하여 새로운 AccessToken과 RefreshToken을 발급합니다.")
    public TokenResponseDto refreshToken(HttpServletRequest request, HttpServletResponse response) {
        return authService.refreshTokens(request, response);
    }
}
