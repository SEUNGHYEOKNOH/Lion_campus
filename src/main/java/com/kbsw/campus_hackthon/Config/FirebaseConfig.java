package com.kbsw.campus_hackthon.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @PostConstruct
    public void initialize() {
        logger.info("FirebaseConfig 초기화 시작");

        try {
            InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-service-account.json");

            if (serviceAccount == null) {
                throw new IllegalStateException("firebase-service-account.json 파일을 classpath에서 찾을 수 없습니다.");
            }
            logger.info("firebase-service-account.json 파일 로드 성공");

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("web-kit-69b0d.firebasestorage.app")  // 확인 필요
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                logger.info("FirebaseApp 초기화 완료");
            } else {
                logger.info("이미 FirebaseApp이 초기화되어 있음");
            }

        } catch (Exception e) {
            logger.error("Firebase 초기화 중 오류 발생", e);
        }
    }
}