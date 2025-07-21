package com.kbsw.campus_hackthon.Service;

import com.kbsw.campus_hackthon.Dto.SearchResultDto;
import com.kbsw.campus_hackthon.Repository.PostRepository;
import com.kbsw.campus_hackthon.Repository.TagRepository;
import com.kbsw.campus_hackthon.entity.Post;
import com.kbsw.campus_hackthon.entity.Tags;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {
    private final TagRepository tagRepository;
    private final PostRepository postRepository;

    /**
     * 키워드로 태그와 포스트 통합 검색
     *
     * @param keyword 검색 키워드
     * @return 검색 결과 리스트
     */
    public List<SearchResultDto> searchByKeyword(String keyword) {
        log.info("=== 검색 서비스 시작 ===");
        log.info("원본 검색 키워드: '{}'", keyword);

        List<SearchResultDto> results = new ArrayList<>();

        if (keyword == null || keyword.trim().isEmpty()) {
            log.warn("검색 키워드가 비어있습니다.");
            return results;
        }

        String searchKeyword = keyword.trim().toLowerCase();
        log.info("처리된 검색 키워드: '{}'", searchKeyword);

        // 1. 태그 검색 (영문명, 한글명 모두 검색)
        List<Tags> matchingTags = tagRepository.findByKeyword(searchKeyword);

        for (Tags tag : matchingTags) {
            // 해당 태그를 가진 포스트 개수 계산
            int postCount = postRepository.countByTag(tag.getTagName());

            SearchResultDto tagResult = SearchResultDto.forTag(
                    tag.getId(),
                    tag.getTagName(),
                    tag.getKoreanName(),
                    tag.getImageUrl(),
                    postCount
            );
            results.add(tagResult);
        }

        // 2. 포스트 검색 (제목, 내용, 태그로 검색)
        List<Post> matchingPosts = postRepository.findByKeyword(searchKeyword);

        for (Post post : matchingPosts) {
            SearchResultDto postResult = SearchResultDto.forPost(
                    post.getId(),
                    post.getTitle(),
                    post.getContent(),
                    post.getImageUrl(),
                    post.getTag()
            );
            results.add(postResult);
        }

        log.info("검색 결과: 태그 {}개, 포스트 {}개", matchingTags.size(), matchingPosts.size());

        return results;
    }

    /**
     * 태그만 검색
     */
    public List<SearchResultDto> searchTagsOnly(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            // 빈 검색어면 모든 태그 반환
            return getAllTags();
        }

        String searchKeyword = keyword.trim().toLowerCase();

        List<Tags> matchingTags = tagRepository.findByKeyword(searchKeyword);

        return matchingTags.stream()
                .map(tag -> {
                    int postCount = postRepository.countByTag(tag.getTagName());
                    return SearchResultDto.forTag(
                            tag.getId(),
                            tag.getTagName(),
                            tag.getKoreanName(),
                            tag.getImageUrl(),
                            postCount
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * 모든 태그 조회
     */
    private List<SearchResultDto> getAllTags() {
        List<Tags> allTags = tagRepository.findAll();
        
        return allTags.stream()
                .map(tag -> {
                    int postCount = postRepository.countByTag(tag.getTagName());
                    return SearchResultDto.forTag(
                            tag.getId(),
                            tag.getTagName(),
                            tag.getKoreanName(),
                            tag.getImageUrl(),
                            postCount
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * 인기 태그 조회 (포스트 수 기준 정렬)
     */
    public List<SearchResultDto> getPopularTags(int limit) {
        List<Tags> allTags = tagRepository.findAll();
        
        return allTags.stream()
                .map(tag -> {
                    int postCount = postRepository.countByTag(tag.getTagName());
                    return SearchResultDto.forTag(
                            tag.getId(),
                            tag.getTagName(),
                            tag.getKoreanName(),
                            tag.getImageUrl(),
                            postCount
                    );
                })
                .sorted((a, b) -> Integer.compare(b.getPostCount(), a.getPostCount())) // 포스트 수 내림차순
                .limit(limit)
                .collect(Collectors.toList());
    }
}
