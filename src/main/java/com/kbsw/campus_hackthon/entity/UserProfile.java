package com.kbsw.campus_hackthon.entity;

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
    @GeneratedValue
    private Long id;

    private String email;
    private String name;
    private String nickname;
    private String birthdate;
    private String provider;
    private String school;
    private String major;
    private String refreshToken;
    private String career;

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tag> tags = new ArrayList<>();

    public void addTag(Tag tag) {
        this.tags.add(tag);
        tag.setUserProfile(this);
    }
}