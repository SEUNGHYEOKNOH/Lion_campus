package com.kbsw.campus_hackthon.Config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    public SwaggerConfig() {
    }

    @Bean
    public OpenAPI openAPI() {
        return (new OpenAPI()).info((new Info()).title("교내 해커톤").version("0.0.1").description("<h3>교내 해커톤</h3>"));
    }
}
