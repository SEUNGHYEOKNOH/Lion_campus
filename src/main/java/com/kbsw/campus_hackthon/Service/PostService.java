package com.kbsw.campus_hackthon.Service;


import com.kbsw.campus_hackthon.Dto.PostRequestdto;
import com.kbsw.campus_hackthon.Dto.PostResponsedto;
import com.kbsw.campus_hackthon.entity.Post;
import com.kbsw.campus_hackthon.entity.UserProfile;
import com.kbsw.campus_hackthon.Repository.PostRepository;
import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserProfileRepository userProfileRepository;

    public PostResponsedto createPost(PostRequestdto dto) {
        UserProfile user = userProfileRepository.findById(dto.getUserProfileId())
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setImageUrl(dto.getImageUrl());
        post.setTag(dto.getTag());
        post.setActive(dto.isActive());
        post.setStartDate(dto.getStartDate());
        post.setEndDate(dto.getEndDate());
        post.setUserProfile(user);

        Post saved = postRepository.save(post);
        return toResponseDto(saved);
    }

    public PostResponsedto getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post 없음"));
        return toResponseDto(post);
    }

    public List<PostResponsedto> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public PostResponsedto updatePost(Long id, PostRequestdto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post 없음"));

        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setImageUrl(dto.getImageUrl());
        post.setTag(dto.getTag());
        post.setStartDate(dto.getStartDate());
        post.setEndDate(dto.getEndDate());

        Post updated = postRepository.save(post);
        return toResponseDto(updated);
    }

    public List<PostResponsedto> getPostByTag(String tag) {
        List<Post> posts = postRepository.findByTagIn(Collections.singletonList(tag));
        return posts.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    private PostResponsedto toResponseDto(Post post) {
        PostResponsedto dto = new PostResponsedto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setTag(post.getTag());
        dto.setStartDate(post.getStartDate());
        dto.setEndDate(post.getEndDate());
        dto.setCreatedAt(post.getCreatedAt().atStartOfDay());
        dto.setUpdatedAt(post.getUpdatedAt().atStartOfDay());
        dto.setWriterNickname(post.getUserProfile().getNickname());
        return dto;
    }
}