package com.kbsw.campus_hackthon.Config;

import com.kbsw.campus_hackthon.filter.JwtAuthenticationProcessingFilter;
import com.kbsw.campus_hackthon.oauth2.handler.OAuth2LoginFailureHandler;
import com.kbsw.campus_hackthon.oauth2.handler.OAuth2LoginSuccessHandler;
import com.kbsw.campus_hackthon.oauth2.service.CustomOAuth2UserService;
import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import com.kbsw.campus_hackthon.Service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtService jwtService;
    private final UserProfileRepository userProfileRepository;

    /**
     * JWT 인증 처리 필터 Bean 생성
     *
     * @return JwtAuthenticationProcessingFilter 인스턴스
     */
    @Bean
    public JwtAuthenticationProcessingFilter jwtAuthenticationProcessingFilter() {
        return new JwtAuthenticationProcessingFilter(jwtService, userProfileRepository);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/login",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/api/v1/oauth2/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/swagger-ui.html",
                                "/webjars/**",
                                "/api/recommend/**",
                                "/api/user/tags",
                                "/api/user/tags/*",
                                "/api/v1/oauth2/naver/**",
                                "/api/v1/oauth2/google/**",
                                "/api/images/upload",
                                "/api/posts/**",
                                "/api/search/**",
                                "/api/images/download/**",
                                "/api/images/download",
                                "/api/auth/refresh"
                        ).permitAll()
                        .requestMatchers("/api/user/me/**").authenticated()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(oAuth2LoginSuccessHandler)
                        .failureHandler(oAuth2LoginFailureHandler)
                )
                // JWT 인증 필터를 LogoutFilter 이후에 추가
                .addFilterAfter(jwtAuthenticationProcessingFilter(), LogoutFilter.class);

        return http.build();
    }
}
