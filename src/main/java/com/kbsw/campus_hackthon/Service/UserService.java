package com.kbsw.campus_hackthon.Service;

import com.kbsw.campus_hackthon.Dto.TagDto;
import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import com.kbsw.campus_hackthon.entity.Tags;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class UserService {

    private final UserProfileRepository userProfileRepository;

    public UserService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    // 사용자의 한글 태그를 가져오는 메소드
    @Transactional
    public List<TagDto> getUserTags(Long userId){
        return userProfileRepository.findById(userId)
                .map(user -> user.getTags().stream()
                        .map(tag -> new TagDto(tag.getTagName(), tag.getKoreanName()))
                        .toList())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }
}
