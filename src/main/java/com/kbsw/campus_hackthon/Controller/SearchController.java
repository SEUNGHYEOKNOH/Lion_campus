package com.kbsw.campus_hackthon.Controller;

import com.kbsw.campus_hackthon.Dto.SearchResultDto;
import com.kbsw.campus_hackthon.Service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@Tag(name = "Search", description = "검색 관련 API")
@RequiredArgsConstructor
@Slf4j
public class SearchController {

    private final SearchService searchService;

    /**
     * 통합 검색 (태그 + 포스트)
     */
    @GetMapping
    @Operation(summary = "통합 검색", description = "키워드로 태그와 포스트를 검색합니다.")
    public ResponseEntity<Map<String, Object>> search(@RequestParam String keyword) {
        try {
            log.info("검색 요청 - 키워드: {}", keyword);
            List<SearchResultDto> results = searchService.searchByKeyword(keyword);
            
            Map<String, Object> response = new HashMap<>();
            response.put("data", results);
            response.put("success", true);
            response.put("message", "검색이 완료되었습니다.");
            
            log.info("검색 결과: {}개", results.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("검색 오류: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("data", List.of());
            errorResponse.put("success", false);
            errorResponse.put("message", "검색 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 태그만 검색
     */
    @GetMapping("/tags")
    @Operation(summary = "태그 검색", description = "키워드로 태그만 검색합니다.")
    public ResponseEntity<Map<String, Object>> searchTags(@RequestParam String keyword) {
        try {
            log.info("태그 검색 요청 - 키워드: {}", keyword);
            List<SearchResultDto> results = searchService.searchTagsOnly(keyword);
            
            Map<String, Object> response = new HashMap<>();
            response.put("data", results);
            response.put("success", true);
            response.put("message", "태그 검색이 완료되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("태그 검색 오류: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("data", List.of());
            errorResponse.put("success", false);
            errorResponse.put("message", "태그 검색 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 인기 태그 조회 (검색어 없을 때 추천용)
     */
    @GetMapping("/popular-tags")
    @Operation(summary = "인기 태그", description = "인기 태그 목록을 조회합니다.")
    public ResponseEntity<Map<String, Object>> getPopularTags(@RequestParam(defaultValue = "10") int limit) {
        try {
            log.info("인기 태그 조회 요청 - 제한: {}개", limit);
            List<SearchResultDto> popularTags = searchService.getPopularTags(limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("data", popularTags);
            response.put("success", true);
            response.put("message", "인기 태그 조회가 완료되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("인기 태그 조회 오류: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("data", List.of());
            errorResponse.put("success", false);
            errorResponse.put("message", "인기 태그 조회 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}