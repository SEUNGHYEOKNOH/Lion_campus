package com.kbsw.campus_hackthon.Repository;

import com.kbsw.campus_hackthon.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByTag(String tag);
    List<Post> findByTagIn(List<String> tags);
    // 추가적인 쿼리 메소드가 필요하다면 여기에 정의할 수 있습니다.
}
