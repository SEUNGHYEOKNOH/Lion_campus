package com.kbsw.campus_hackthon.Dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class PostResponsedto {
    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private String tag;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive; // 공개 여부
    private String writerNickname; // 응답에 작성자 닉네임 포함
}