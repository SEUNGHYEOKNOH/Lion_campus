package com.kbsw.campus_hackthon.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleRequestdto {
    private String clientId;
    private String redirectUri;
    private String clientSecret;
    private String responseType;
    private String scope;
    private String code;
    private String accessType;
    private String grantType;
    private String state;
    private String includeGrantedScopes;
    private String loginHint;
    private String prompt;
}