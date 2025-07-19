package com.kbsw.campus_hackthon.Dto;

import com.kbsw.campus_hackthon.common.Role;
import com.kbsw.campus_hackthon.common.SocialType;
import com.kbsw.campus_hackthon.entity.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 사용자 정보 응답 DTO
 * 클라이언트에게 전달할 사용자 정보를 담는 클래스
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long id;
    private String email;
    private String name;
    private String nickname;
    private String provider;
    private String school;
    private String major;
    private String career;
    private Role role;
    private SocialType socialType;
    private String imageUrl;
    private List<String> tags;

    /**
     * UserProfile 엔티티를 UserResponseDto로 변환
     *
     * @param userProfile 사용자 프로필 엔티티
     * @return UserResponseDto
     */
    public static UserResponseDto from(UserProfile userProfile) {
        List<String> tagNames = userProfile.getTags() != null
                ? userProfile.getTags().stream()
                .map(tag -> tag.getTagName())
                .collect(Collectors.toList())
                : List.of();

        return UserResponseDto.builder()
                .id(userProfile.getId())
                .email(userProfile.getEmail())
                .name(userProfile.getName())
                .nickname(userProfile.getNickname())
                .provider(userProfile.getProvider())
                .school(userProfile.getSchool())
                .major(userProfile.getMajor())
                .career(userProfile.getCareer())
                .role(userProfile.getRole())
                .socialType(userProfile.getSocialType())
                .imageUrl(userProfile.getImageUrl())
                .tags(tagNames)
                .build();
    }
} 