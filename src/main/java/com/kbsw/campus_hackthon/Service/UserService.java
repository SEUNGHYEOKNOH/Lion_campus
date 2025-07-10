package com.kbsw.campus_hackthon.Service;

import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import com.kbsw.campus_hackthon.entity.Tags;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class UserService {

    private final UserProfileRepository userProfileRepository;

    public UserService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    // 사용자의 한글 태그를 가져오는 메소드
    public List<String> getUserKorTags(Long userId){
        return userProfileRepository.findById(userId)
                .map(user -> user.getTags().stream()
                        .map(Tags::getKoreanName) // 태그 이름을 가져옴
                        .toList())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }
}
