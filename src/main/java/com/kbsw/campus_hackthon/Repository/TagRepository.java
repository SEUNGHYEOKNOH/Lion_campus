package com.kbsw.campus_hackthon.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kbsw.campus_hackthon.entity.Tag;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserProfileId(Long userId);
}