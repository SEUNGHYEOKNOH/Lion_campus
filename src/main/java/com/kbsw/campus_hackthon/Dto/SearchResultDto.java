package com.kbsw.campus_hackthon.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    private String type;        // "tag" 또는 "post"
    private Long id;
    private String title;       // 태그명 또는 포스트 제목
    private String description; // 태그 한글명 또는 포스트 내용
    private String imageUrl;
    private String tagName;     // 영문 태그명
    private String koreanName;  // 한글 태그명
    private Integer postCount;  // 해당 태그의 포스트 수

    // 태그 검색 결과용 생성자
    public static SearchResultDto forTag(Long id, String tagName, String koreanName, String imageUrl, Integer postCount) {
        return new SearchResultDto("tag", id, tagName, koreanName, imageUrl, tagName, koreanName, postCount);
    }

    // 포스트 검색 결과용 생성자
    public static SearchResultDto forPost(Long id, String title, String content, String imageUrl, String tag) {
        // 내용을 100자로 제한
        String limitedContent = content != null && content.length() > 100 
            ? content.substring(0, 100) + "..." 
            : content;
        return new SearchResultDto("post", id, title, limitedContent, imageUrl, tag, null, null);
    }
}
