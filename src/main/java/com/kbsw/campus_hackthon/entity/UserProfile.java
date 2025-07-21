package com.kbsw.campus_hackthon.entity;

import com.kbsw.campus_hackthon.common.Role;
import com.kbsw.campus_hackthon.common.SocialType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String name;
    private String nickname;
    private String provider;
    private String school;
    private String major;
    private String refreshToken;
    private String career;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private SocialType socialType; // KAKAO, GOOGLE, NAVER

    private String socialId;
    private String imageUrl;

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tags> tags = new ArrayList<>();


    public void addTag(Tags tags) {
        this.tags.add(tags);
        tags.setUserProfile(this);
    }



    /**
     * Refresh Token 업데이트
     *
     * @param refreshToken 새로운 Refresh Token
     */
    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}