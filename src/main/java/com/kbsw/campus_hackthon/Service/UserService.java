package com.kbsw.campus_hackthon.Service;

import com.kbsw.campus_hackthon.Dto.TagDto;
import com.kbsw.campus_hackthon.Dto.UserResponseDto;
import com.kbsw.campus_hackthon.Dto.UserUpdateDto;
import com.kbsw.campus_hackthon.Repository.TagRepository;
import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import com.kbsw.campus_hackthon.entity.Tags;
import com.kbsw.campus_hackthon.entity.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;
    private final TagRepository tagRepository;

    // 사용자의 한글 태그를 가져오는 메소드
    @Transactional
    public List<TagDto> getUserTags(Long userId) {
        return userProfileRepository.findById(userId)
                .map(user -> user.getTags().stream()
                        .map(tag -> new TagDto(tag.getTagName(), tag.getKoreanName()))
                        .toList())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    /**
     * 이메일로 사용자 정보 조회
     * JWT 토큰에서 추출한 이메일로 사용자 정보를 조회합니다.
     *
     * @param email 사용자 이메일
     * @return UserResponseDto 사용자 정보
     */
    @Transactional(readOnly = true)
    public UserResponseDto getUserByEmail(String email) {
        UserProfile userProfile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + email));

        return UserResponseDto.from(userProfile);
    }

    /**
     * 사용자 정보 수정
     *
     * @param email     사용자 이메일
     * @param updateDto 수정할 사용자 정보
     * @return UserResponseDto 수정된 사용자 정보
     */
    @Transactional
    public UserResponseDto updateUser(String email, UserUpdateDto updateDto) {
        UserProfile userProfile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + email));

        // 사용자 정보 업데이트
        updateUserProfile(userProfile, updateDto);

        // 태그 업데이트
        if (updateDto.getTags() != null) {
            updateUserTags(userProfile, updateDto.getTags());
        }

        // 추가 정보를 입력한 경우 Role을 USER로 변경
        if (userProfile.getRole() == com.kbsw.campus_hackthon.common.Role.GUEST) {
            // 기본 정보가 입력되었는지 확인
            if (isProfileCompleted(userProfile, updateDto)) {
                userProfile.setRole(com.kbsw.campus_hackthon.common.Role.USER);
                log.info("사용자 역할이 GUEST에서 USER로 변경되었습니다. Email: {}", email);
            }
        }

        UserProfile savedUser = userProfileRepository.save(userProfile);
        log.info("사용자 정보가 업데이트되었습니다. Email: {}", email);

        return UserResponseDto.from(savedUser);
    }

    /**
     * 사용자 프로필 정보 업데이트
     * name과 email은 소셜 로그인에서 가져온 정보이므로 수정하지 않음
     *
     * @param userProfile 사용자 프로필 엔티티
     * @param updateDto   업데이트할 정보
     */
    private void updateUserProfile(UserProfile userProfile, UserUpdateDto updateDto) {
        // name과 email은 소셜 로그인 정보이므로 업데이트하지 않음

        if (updateDto.getNickname() != null && !updateDto.getNickname().trim().isEmpty()) {
            userProfile.setNickname(updateDto.getNickname().trim());
        }
        if (updateDto.getSchool() != null && !updateDto.getSchool().trim().isEmpty()) {
            userProfile.setSchool(updateDto.getSchool().trim());
        }
        if (updateDto.getMajor() != null && !updateDto.getMajor().trim().isEmpty()) {
            userProfile.setMajor(updateDto.getMajor().trim());
        }
        if (updateDto.getCareer() != null && !updateDto.getCareer().trim().isEmpty()) {
            userProfile.setCareer(updateDto.getCareer().trim());
        }
        if (updateDto.getImageUrl() != null && !updateDto.getImageUrl().trim().isEmpty()) {
            userProfile.setImageUrl(updateDto.getImageUrl().trim());
        }
    }

    /**
     * 사용자 태그 업데이트
     *
     * @param userProfile 사용자 프로필 엔티티
     * @param tagNames    새로운 태그 이름 목록
     */
    private void updateUserTags(UserProfile userProfile, List<String> tagNames) {
        // 기존 태그 제거
        userProfile.getTags().clear();

        // 새로운 태그 추가
        for (String tagName : tagNames) {
            if (tagName != null && !tagName.trim().isEmpty()) {
                Tags tag = Tags.builder()
                        .tagName(tagName.trim())
                        .koreanName(tagName.trim()) // 기본값으로 설정, 필요시 별도 매핑 로직 추가
                        .userProfile(userProfile)
                        .build();
                userProfile.addTag(tag);
            }
        }
    }

    /**
     * 프로필이 완성되었는지 확인
     * 닉네임, 대학교, 학과, 희망진로가 모두 입력되어야 프로필 완성으로 간주
     *
     * @param userProfile 사용자 프로필
     * @param updateDto   업데이트 정보
     * @return 프로필 완성 여부
     */
    private boolean isProfileCompleted(UserProfile userProfile, UserUpdateDto updateDto) {
        // 각 필드의 최종 값 계산 (업데이트 값이 있으면 사용, 없으면 기존 값 사용)
        String nickname = updateDto.getNickname() != null ? updateDto.getNickname() : userProfile.getNickname();
        String school = updateDto.getSchool() != null ? updateDto.getSchool() : userProfile.getSchool();
        String major = updateDto.getMajor() != null ? updateDto.getMajor() : userProfile.getMajor();
        String career = updateDto.getCareer() != null ? updateDto.getCareer() : userProfile.getCareer();
        
        // 모든 필수 정보가 입력되었는지 확인
        boolean isNicknameComplete = nickname != null && !nickname.trim().isEmpty();
        boolean isSchoolComplete = school != null && !school.trim().isEmpty();
        boolean isMajorComplete = major != null && !major.trim().isEmpty();
        boolean isCareerComplete = career != null && !career.trim().isEmpty();
        
        boolean isCompleted = isNicknameComplete && isSchoolComplete && isMajorComplete && isCareerComplete;
        
        log.info("프로필 완성도 체크 - 닉네임: {}, 대학교: {}, 학과: {}, 희망진로: {}, 완성 여부: {}", 
                isNicknameComplete, isSchoolComplete, isMajorComplete, isCareerComplete, isCompleted);
        
        return isCompleted;
    }

    /**
     * 사용자 삭제 (회원 탈퇴)
     *
     * @param email 사용자 이메일
     */
    @Transactional
    public void deleteUser(String email) {
        UserProfile userProfile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + email));

        userProfileRepository.delete(userProfile);
        log.info("사용자가 탈퇴되었습니다. Email: {}", email);
    }
}
