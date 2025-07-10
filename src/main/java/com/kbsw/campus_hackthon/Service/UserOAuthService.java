package com.kbsw.campus_hackthon.Service;

import com.kbsw.campus_hackthon.Dto.GoogleRequestdto;
import com.kbsw.campus_hackthon.Dto.GoogleResponsedto;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class UserOAuthService {

    private final String googleClientId;
    private final String googleClientSecret;
    private final String naverClientId; // 네이버 클라이언트 ID는 환경변수로 설정 필요
    private final String naverClientPw; // 네이버 클라이언트 시크릿도 환경변수로 설정 필요
    private final AuthService authService;

    public UserOAuthService( AuthService authService, Dotenv dotenv) {
        this.googleClientId = dotenv.get("GOOGLE_CLIENT_ID");
        this.googleClientSecret = dotenv.get("GOOGLE_CLIENT_SECRET");
        this.naverClientId = dotenv.get("NAVER_CLIENT_ID");
        this.naverClientPw = dotenv.get("NAVER_CLIENT_SECRET");
        this.authService = authService;
    }


    public String buildGoogleLoginUrl() {
        String redirectUri = "http://localhost:8080/api/v1/oauth2/google/callback";
        return "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + googleClientId
                + "&redirect_uri=" + redirectUri
                + "&response_type=code"
                + "&scope=https://www.googleapis.com/auth/userinfo.email"
                + "+https://www.googleapis.com/auth/userinfo.profile"
                + "+https://www.googleapis.com/auth/user.birthday.read"
                + "+https://www.googleapis.com/auth/user.addresses.read"
                + "&access_type=offline";
    }

    public String buildnaverLoginUrl(){
        String naverredirectUri ="http://localhost:8080/api/v1/oauth2/naver/callback";

               return "https://nid.naver.com/oauth2.0/authorize?response_type=code&"
                       + "client_id="+ naverClientId
                       + "&state=STATE_STRING&" +
                 "redirect_uri=" + naverredirectUri;
    }
////

    public ResponseEntity<?> loginWithGoogle(String authCode) {
        RestTemplate restTemplate = new RestTemplate();
        String redirectUri = "http://localhost:8080/api/v1/oauth2/google/callback";

        GoogleRequestdto requestDto = GoogleRequestdto.builder()
                .clientId(googleClientId)
                .clientSecret(googleClientSecret)
                .code(authCode)
                .redirectUri(redirectUri)
                .grantType("authorization_code")
                .build();

        ResponseEntity<GoogleResponsedto> tokenResponse = restTemplate.postForEntity(
                "https://oauth2.googleapis.com/token", requestDto, GoogleResponsedto.class);
        String accessToken = tokenResponse.getBody().getAccess_token();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // 사용자 기본 정보
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                "https://www.googleapis.com/oauth2/v2/userinfo", HttpMethod.GET, entity, Map.class);
        Map<String, Object> userInfo = userInfoResponse.getBody();
        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");

        // 생일 정보
        ResponseEntity<Map> birthdayResponse = restTemplate.exchange(
                "https://people.googleapis.com/v1/people/me?personFields=birthdays", HttpMethod.GET, entity, Map.class);

        String birthdate = parseBirthdate(birthdayResponse.getBody());

        // 사용자 인증/등록 처리
        return authService.authenticate(email); // 또는 사용자 DB 저장 포함
    }

    private String parseBirthdate(Map body) {
        try {
            List<Map<String, Object>> birthdays = (List<Map<String, Object>>) body.get("birthdays");
            if (birthdays != null && !birthdays.isEmpty()) {
                Map<String, Object> date = (Map<String, Object>) birthdays.get(0).get("date");
                int year = (Integer) date.getOrDefault("year", 2000);
                int month = (Integer) date.getOrDefault("month", 1);
                int day = (Integer) date.getOrDefault("day", 1);
                return String.format("%04d-%02d-%02d", year, month, day);
            }
        } catch (Exception e) {
            log.warn("생일 정보 파싱 실패: {}", e.getMessage());
        }
        return "";
    }
}
