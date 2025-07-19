package com.kbsw.campus_hackthon.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * 사용자 정보 수정 요청 DTO
 * 클라이언트에서 전달받을 사용자 정보 수정 데이터를 담는 클래스
 * name과 email은 소셜 로그인 정보이므로 수정 불가
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {

    @Size(max = 50, message = "닉네임은 50자를 초과할 수 없습니다.")
    private String nickname;

    @Size(max = 100, message = "학교명은 100자를 초과할 수 없습니다.")
    private String school;

    @Size(max = 100, message = "전공명은 100자를 초과할 수 없습니다.")
    private String major;

    @Size(max = 100, message = "희망진로는 100자를 초과할 수 없습니다.")
    private String career;

    private String imageUrl;

    private List<String> tags;
} 