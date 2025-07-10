package com.kbsw.campus_hackthon.Controller;

import com.kbsw.campus_hackthon.entity.CareerItem;
import com.kbsw.campus_hackthon.Service.TFIDFRecommenderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/recommend"})
@Tag(name = "Recommend", description = "추천 알고리즘 API")
public class RecommendController {
    private final TFIDFRecommenderService recommenderService;

    public RecommendController(TFIDFRecommenderService recommenderService) {
        this.recommenderService = recommenderService;
    }

    @PostMapping
    @Operation(summary = "키워드 기반 추천", description = "사용자가 입력한 키워드로 진로 아이템을 추천합니다.")
    public List<CareerItem> recommend(@RequestBody List<String> keywords) {
        return this.recommenderService.recommendByKeywords(keywords);
    }

    @PutMapping({"/user/{id}"})
    @Operation(summary = "유저 프로필 업데이트", description = "유저의 진로 프로필을 업데이트합니다.")
    public void updateUserProfile(@PathVariable Long id, @RequestBody List<String> careers) {
        this.recommenderService.updateUserProfile(id, careers);
    }
}
