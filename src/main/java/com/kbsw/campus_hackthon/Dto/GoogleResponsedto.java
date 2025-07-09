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
public class GoogleResponsedto {
    private String access_token;
    private String expires_in;
    private String refresh_token;
    private String scope;
    private String token_type;
    private String id_token;
}