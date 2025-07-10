package com.kbsw.campus_hackthon.Controller;


import com.kbsw.campus_hackthon.Repository.TagRepository;
import com.kbsw.campus_hackthon.Service.UserService;
import com.kbsw.campus_hackthon.entity.Tags;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/user"})
@Tag(name = "User", description = "사용자 관련 API"
)
public class UserController {
    private final TagRepository tagRepository;
    private final UserService userService;

    public UserController(final TagRepository tagRepository, UserService userService) {
        this.tagRepository = tagRepository;
        this.userService = userService;
    }


    @GetMapping({"/tags/{userId}"})
    @Operation(summary = "사용자 태그 조회", description = "특정 사용자의 태그 목록을 조회합니다.")
    public List<String> getUserTags(@PathVariable Long userId) {
        return userService.getUserKorTags(userId);

    }



}
