package com.kbsw.campus_hackthon.Controller;


import com.kbsw.campus_hackthon.Dto.GoogleRequestdto;
import com.kbsw.campus_hackthon.Dto.GoogleResponsedto;
import com.kbsw.campus_hackthon.Service.AuthService;
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
@RequestMapping({"/api/v1/oauth2/google"})
@Tag(
        name = "Login",
        description = "구글 로그인 API"
)
public class LoginController {


    private final Dotenv dotenv;
    private final String googleClientId;
    private final String googleClientSecret;
    private final AuthService authService;


    @Autowired
    public LoginController(Dotenv dotenv1, Dotenv dotenv, AuthService authService) {
        this.dotenv = dotenv;
        this.googleClientId = dotenv.get("GOOGLE_CLIENT_ID");
        this.googleClientSecret = dotenv.get("GOOGLE_CLIENT_SECRET");
        this.authService = authService;
    }



    private static final Logger log = LoggerFactory.getLogger(LoginController.class);

    @GetMapping({"/login"})
    @Operation(
            summary = "구글 로그인 리다이렉트",
            description = "구글 로그인 페이지로 리다이렉트합니다. -> http://localhost:8080/api/v1/oauth2/google/login "
    )
    public void redirectToGoogleLogin(HttpServletResponse response) throws IOException {
        String redirectUri = "http://localhost:8080/api/v1/oauth2/google/callback";
        String googleLoginUrl = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + this.googleClientId + "&redirect_uri=" + redirectUri + "&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/user.birthday.read+https://www.googleapis.com/auth/user.addresses.read&access_type=offline";
        log.info("✅ Redirect URL: {}", googleLoginUrl);
        response.sendRedirect(googleLoginUrl);
    }

    @GetMapping({"/callback"})
    @Operation(
            summary = "구글 콜백 처리",
            description = "구글 로그인 후 사용자 정보를 받아옵니다."
    )
    public ResponseEntity<?> handleGoogleCallback(@RequestParam("code") String authCode) {
        RestTemplate restTemplate = new RestTemplate();
        String redirectUri = "http://localhost:8080/api/v1/oauth2/google/callback";
        GoogleRequestdto requestDto = GoogleRequestdto.builder().clientId(this.googleClientId).clientSecret(this.googleClientSecret).code(authCode).redirectUri(redirectUri).grantType("authorization_code").build();
        ResponseEntity<GoogleResponsedto> tokenResponse = restTemplate.postForEntity("https://oauth2.googleapis.com/token", requestDto, GoogleResponsedto.class, new Object[0]);
        String accessToken = ((GoogleResponsedto)tokenResponse.getBody()).getAccess_token();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity(headers);
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange("https://www.googleapis.com/oauth2/v2/userinfo", HttpMethod.GET, entity, Map.class, new Object[0]);
        Map<String, Object> userInfo = (Map)userInfoResponse.getBody();
        String email = (String)userInfo.get("email");
        String name = (String)userInfo.get("name");
        ResponseEntity<Map> birthdayResponse = restTemplate.exchange("https://people.googleapis.com/v1/people/me?personFields=birthdays", HttpMethod.GET, entity, Map.class, new Object[0]);
        String birthdate = "";

        try {
            List<Map<String, Object>> birthdays = (List)((Map)birthdayResponse.getBody()).get("birthdays");
            if (birthdays != null && !birthdays.isEmpty()) {
                Map<String, Object> date = (Map)((Map)birthdays.get(0)).get("date");
                int year = (Integer)date.getOrDefault("year", 2000);
                int month = (Integer)date.getOrDefault("month", 1);
                int day = (Integer)date.getOrDefault("day", 1);
                birthdate = String.format("%04d-%02d-%02d", year, month, day);
            }
        } catch (Exception e) {
            log.warn("생일 정보 파싱 실패: {}", e.getMessage());
        }

        return this.authService.authenticate(email);
    }
}
