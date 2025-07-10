package com.kbsw.campus_hackthon.Controller;


import com.kbsw.campus_hackthon.Dto.GoogleRequestdto;
import com.kbsw.campus_hackthon.Dto.GoogleResponsedto;
import com.kbsw.campus_hackthon.Service.AuthService;
import com.kbsw.campus_hackthon.Service.UserOAuthService;
import com.kbsw.campus_hackthon.Service.UserService;
import io.github.cdimascio.dotenv.Dotenv;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@CrossOrigin({"*"})
@RequestMapping({"/api/v1/oauth2/"})
@Tag(
        name = "Login",
        description = "구글 로그인 API"
)
public class LoginController {

    private final UserOAuthService userOAuthService;

    public LoginController(UserOAuthService userOAuthService) {
        this.userOAuthService = userOAuthService;}

    // Controller
    @GetMapping("google/login")
    public void redirectToGoogleLogin(HttpServletResponse response) throws IOException {
        response.sendRedirect(userOAuthService.buildGoogleLoginUrl());
    }

    @GetMapping("/naver/login")
    @Operation(summary = "네이버 로그인 URL 생성", description = "네이버 로그인 페이지로 리다이렉트합니다.")
    public void redirectToNaverLogin(HttpServletResponse response) throws IOException {
        response.sendRedirect(userOAuthService.buildnaverLoginUrl());
    }


    @GetMapping("/callback")
    @Operation(summary = "구글 콜백 처리", description = "구글 로그인 후 사용자 정보를 받아옵니다.")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam("code") String authCode) {
        return userOAuthService.loginWithGoogle(authCode);
    }
}
