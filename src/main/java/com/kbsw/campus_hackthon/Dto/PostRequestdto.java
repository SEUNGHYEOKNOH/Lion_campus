package com.kbsw.campus_hackthon.Dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PostRequestdto {
    private String title;
    private String content;
    private String imageUrl; // 업로드 후 받은 Firebase URL
    private String tag;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean isActive; // 공개 여부
    private Long userProfileId; // 작성자 식별자
}