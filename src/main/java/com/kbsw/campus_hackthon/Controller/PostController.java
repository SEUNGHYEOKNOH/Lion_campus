package com.kbsw.campus_hackthon.Controller;

import com.kbsw.campus_hackthon.Dto.PostRequestdto;
import com.kbsw.campus_hackthon.Dto.PostResponsedto;
import com.kbsw.campus_hackthon.Service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Post", description = "게시글 관련 API")
public class PostController {

    private final PostService postService;

    @PostMapping
    @Operation(summary = "게시글 생성")
    public ResponseEntity<PostResponsedto> createPost(@RequestBody PostRequestdto dto) {
        return ResponseEntity.ok(postService.createPost(dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "게시글 단건 조회")
    public ResponseEntity<PostResponsedto> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    @GetMapping
    @Operation(summary = "전체 게시글 목록 조회")
    public ResponseEntity<List<PostResponsedto>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PutMapping("/{id}")
    @Operation(summary = "게시글 수정")
    public ResponseEntity<PostResponsedto> updatePost(@PathVariable Long id, @RequestBody PostRequestdto dto) {
        return ResponseEntity.ok(postService.updatePost(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "게시글 삭제")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tag/{tag}")
    @Operation(summary = "태그로 게시글 목록 조회")
    public ResponseEntity<List<PostResponsedto>> getPostsByTag(@PathVariable String tag) {
        return ResponseEntity.ok(postService.getPostByTag(tag));
    }
}

