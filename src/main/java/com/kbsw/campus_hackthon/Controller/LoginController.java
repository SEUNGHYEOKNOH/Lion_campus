package com.kbsw.campus_hackthon.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 실제로는 호출되지 않으며 문서화 목적을 위해 만든 컨트롤러
 */
@RestController
@Tag(name = "Login", description = "소셜 로그인 관련 엔드포인트")
public class LoginController {

    @GetMapping("/oauth2/authorization/{provider}")
    @Operation(
            summary = "소셜 로그인 시작",
            description = "지정된 소셜 로그인 제공자로 OAuth 인증을 시작합니다.",
            parameters = @Parameter(name = "provider", description = "google, naver, kakao 중 하나")
    )
    public void startOAuthLogin(@PathVariable String provider) {
        // 실제로는 호출되지 않음 - 문서화 목적만
        throw new UnsupportedOperationException("Documentation only");
    }

    @GetMapping("/login/oauth2/code/{provider}")
    @Operation(
            summary = "OAuth 콜백",
            description = "OAuth 서버에서 인증 완료 후 돌아오는 콜백 엔드포인트"
    )
    public void oauthCallback(@PathVariable String provider,
                              @RequestParam String code,
                              @RequestParam String state) {
        // 실제로는 호출되지 않음 - 문서화 목적만
        throw new UnsupportedOperationException("Documentation only");
    }
}
