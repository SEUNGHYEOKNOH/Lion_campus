package com.kbsw.campus_hackthon.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.kbsw.campus_hackthon.entity.Tags;

import java.util.List;

public interface TagRepository extends JpaRepository<Tags, Long> {
    List<Tags> findByUserProfileId(Long userId);
    
    // 메서드명이 너무 길어서 @Query 사용
    @Query("SELECT t FROM Tags t WHERE " +
           "LOWER(t.tagName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.koreanName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Tags> findByKeyword(@Param("keyword") String keyword);
}