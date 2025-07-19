package com.kbsw.campus_hackthon.Controller;

import com.kbsw.campus_hackthon.Dto.TagDto;
import com.kbsw.campus_hackthon.Dto.UserResponseDto;
import com.kbsw.campus_hackthon.Dto.UserUpdateDto;
import com.kbsw.campus_hackthon.Repository.TagRepository;
import com.kbsw.campus_hackthon.Service.UserService;
import com.kbsw.campus_hackthon.entity.Tags;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User", description = "사용자 관련 API")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final TagRepository tagRepository;
    private final UserService userService;


    @GetMapping("/tags/{userId}")
    @Operation(summary = "사용자 태그 조회 (한글+영문)")
    public ResponseEntity<List<TagDto>> getUserTags(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserTags(userId));
    }

    @GetMapping("/tags")
    @Operation(summary = "전체 태그 조회", description = "시스템에 등록된 모든 태그 목록을 조회합니다.")
    public ResponseEntity<List<Tags>> getAllTags() {
        List<Tags> tags = tagRepository.findAll();
        return ResponseEntity.ok(tags);
    }

    /**
     * 현재 로그인한 사용자 정보 조회
     * JWT 토큰을 통해 인증된 사용자의 정보를 반환합니다.
     *
     * @param authentication Spring Security Authentication 객체
     * @return UserResponseDto 사용자 정보
     */
    @GetMapping("/me")
    @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    public ResponseEntity<UserResponseDto> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.warn("인증되지 않은 사용자의 정보 조회 시도");
            return ResponseEntity.status(401).build();
        }

        try {
            String email = authentication.getName();
            UserResponseDto userInfo = userService.getUserByEmail(email);
            log.info("사용자 정보 조회 성공. Email: {}", email);
            return ResponseEntity.ok(userInfo);
        } catch (RuntimeException e) {
            log.error("사용자 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(404).build();
        }
    }

    /**
     * 현재 로그인한 사용자 정보 수정
     *
     * @param authentication Spring Security Authentication 객체
     * @param updateDto      수정할 사용자 정보
     * @return UserResponseDto 수정된 사용자 정보
     */
    @PutMapping("/me")
    @Operation(summary = "내 정보 수정", description = "현재 로그인한 사용자의 정보를 수정합니다.")
    public ResponseEntity<UserResponseDto> updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UserUpdateDto updateDto) {

        if (authentication == null || authentication.getName() == null) {
            log.warn("인증되지 않은 사용자의 정보 수정 시도");
            return ResponseEntity.status(401).build();
        }

        try {
            String email = authentication.getName();
            UserResponseDto updatedUser = userService.updateUser(email, updateDto);
            log.info("사용자 정보 수정 성공. Email: {}", email);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("사용자 정보 수정 실패: {}", e.getMessage());
            return ResponseEntity.status(400).build();
        }
    }

    /**
     * 회원 탈퇴
     *
     * @param authentication Spring Security Authentication 객체
     * @return ResponseEntity
     */
    @DeleteMapping("/me")
    @Operation(summary = "회원 탈퇴", description = "현재 로그인한 사용자를 탈퇴시킵니다.")
    public ResponseEntity<Void> deleteCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.warn("인증되지 않은 사용자의 탈퇴 시도");
            return ResponseEntity.status(401).build();
        }

        try {
            String email = authentication.getName();
            userService.deleteUser(email);
            log.info("사용자 탈퇴 성공. Email: {}", email);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.error("사용자 탈퇴 실패: {}", e.getMessage());
            return ResponseEntity.status(400).build();
        }
    }
}
