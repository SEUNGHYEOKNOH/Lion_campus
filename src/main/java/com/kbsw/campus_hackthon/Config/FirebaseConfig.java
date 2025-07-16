package com.kbsw.campus_hackthon.Config;


import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        System.out.println("FirebaseConfig 초기화 시작");

        try {
            InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-service-account.json");

            if (serviceAccount == null) {
                throw new IllegalStateException("firebase-service-account.json 파일을 classpath에서 찾을 수 없습니다.");
            }
            System.out.println("firebase-service-account.json 파일 로드 성공");

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("web-kit-69b0d.firebasestorage.app")
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println(" FirebaseApp 초기화 완료");
            } else {
                System.out.println("이미 FirebaseApp이 초기화되어 있음");
            }

        } catch (Exception e) {
            System.out.println("Firebase 초기화 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
