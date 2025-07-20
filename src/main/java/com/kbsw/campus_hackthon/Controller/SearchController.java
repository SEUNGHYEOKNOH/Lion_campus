//package com.kbsw.campus_hackthon.Controller;
//
//import com.kbsw.campus_hackthon.Service.SearchService;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/search")
//public class SearchController {
//
//    private final SearchService searchService;
//
//    public SearchController(SearchService searchService) {
//        this.searchService = searchService;
//    }
//
//    @GetMapping
//    public List<SearchResultDto> search(@RequestParam String keyword) {
//        return searchService.searchByKeyword(keyword);
//    }
//}