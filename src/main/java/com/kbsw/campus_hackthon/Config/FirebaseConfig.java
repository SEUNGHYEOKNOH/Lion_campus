package com.kbsw.campus_hackthon.Config;


import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
                // 🔥 환경변수에서 JSON 키 문자열 불러오기
                String firebaseConfig = System.getenv("FIREBASE_CONFIG");
                if (firebaseConfig == null || firebaseConfig.isEmpty()) {
                    throw new IllegalStateException("환경변수 FIREBASE_CONFIG가 설정되지 않았습니다.");
                }

            InputStream serviceAccount = getClass()
                    .getClassLoader()
                    .getResourceAsStream("firebase-service-account.json");

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("web-kit-69b0d") // ✅ 정확한 Storage 버킷 이름
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("✅ Firebase 초기화 성공");
            }

        } catch (IOException e) {
            System.err.println("❌ Firebase 초기화 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
