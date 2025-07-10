package com.kbsw.campus_hackthon.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kbsw.campus_hackthon.entity.Tags;

import java.util.List;

public interface TagRepository extends JpaRepository<Tags, Long> {
    List<Tags> findByUserProfileId(Long userId);
}