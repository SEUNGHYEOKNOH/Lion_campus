package com.kbsw.campus_hackthon.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TagDto {
    private String tagName;     // 영어
    private String koreanName;  // 한글
}