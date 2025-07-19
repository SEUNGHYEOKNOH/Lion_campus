package com.kbsw.campus_hackthon.util;

import java.security.SecureRandom;

/**
 * 비밀번호 관련 유틸리티 클래스
 * 소셜 로그인 사용자를 위한 임시 비밀번호 생성 등의 기능 제공
 */
public class PasswordUtil {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    private static final int PASSWORD_LENGTH = 20;
    private static final SecureRandom random = new SecureRandom();

    /**
     * 안전한 랜덤 비밀번호 생성
     * 소셜 로그인 사용자의 인증 처리를 위해 사용
     *
     * @return 생성된 랜덤 비밀번호
     */
    public static String generateRandomPassword() {
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(randomIndex));
        }

        return password.toString();
    }

    /**
     * 지정된 길이의 랜덤 비밀번호 생성
     *
     * @param length 비밀번호 길이
     * @return 생성된 랜덤 비밀번호
     */
    public static String generateRandomPassword(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("비밀번호 길이는 0보다 커야 합니다.");
        }

        StringBuilder password = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(randomIndex));
        }

        return password.toString();
    }
} 