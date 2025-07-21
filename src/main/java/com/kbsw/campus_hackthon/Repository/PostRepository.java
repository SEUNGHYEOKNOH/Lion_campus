package com.kbsw.campus_hackthon.Repository;

import com.kbsw.campus_hackthon.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByTag(String tag);
    List<Post> findByTagIn(List<String> tags);
    int countByTag(String tag);

    // 메서드명이 너무 길어서 @Query 사용
    @Query("SELECT p FROM Post p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.tag) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Post> findByKeyword(@Param("keyword") String keyword);
}
