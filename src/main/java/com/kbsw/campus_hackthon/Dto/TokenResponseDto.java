package com.kbsw.campus_hackthon.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponseDto {

    private String accessToken;
    private String refreshToken;
    private String message;

    public static TokenResponseDto success(String accessToken, String refreshToken) {
        return new TokenResponseDto(accessToken, refreshToken, "토큰이 성공적으로 갱신되었습니다.");
    }
}
