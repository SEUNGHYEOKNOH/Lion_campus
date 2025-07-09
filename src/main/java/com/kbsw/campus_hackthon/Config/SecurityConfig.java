package com.kbsw.campus_hackthon.Config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    public SecurityConfig() {
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf((csrf) -> csrf.disable()).formLogin((form) -> form.disable()).httpBasic((basic) -> basic.disable()).authorizeHttpRequests((auth) -> ((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)auth.requestMatchers(new String[]{"/api/v1/oauth2/**", "/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**", "/swagger-ui.html", "/webjars/**", "/api/recommend/**", "/api/user/tags/**"})).permitAll().anyRequest()).authenticated());
        return (SecurityFilterChain)http.build();
    }
}
