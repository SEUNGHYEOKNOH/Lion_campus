package com.kbsw.campus_hackthon.Repository;

import com.kbsw.campus_hackthon.common.SocialType;
import com.kbsw.campus_hackthon.entity.UserProfile;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(
        exported = false
)
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByEmail(String email);

    /**
     * 소셜 타입과 소셜의 식별값으로 회원 찾는 메소드
     * 정보 제공을 동의한 순간 DB에 저장해야하지만, 아직 추가 정보(닉네임, 학교, 전공, 커리어 등)를 입력받지 않았으므로
     * 유저 객체는 DB에 있지만, 추가 정보가 빠진 상태이다.
     * 따라서 추가 정보를 입력받아 회원 가입을 진행할 때 소셜 타입, 식별자로 해당 회원을 찾기 위한 메소드
     */
    Optional<UserProfile> findBySocialTypeAndSocialId(SocialType socialType, String socialId);

    /**
     * RefreshToken으로 회원 찾기
     * JWT 인증 필터에서 RefreshToken 검증 시 사용
     */
    Optional<UserProfile> findByRefreshToken(String refreshToken);
}
