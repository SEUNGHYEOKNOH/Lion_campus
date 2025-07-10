package com.kbsw.campus_hackthon.Controller;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Tag(name = "FirebaseImageUploadController", description = "Firebase Storage에 이미지 API")
public class ImageController {

    @PostMapping("/upload")
    @Operation(summary = "이미지 업로드", description = "Firebase Storage에 이미지를 업로드하고 다운로드 URL을 반환합니다.")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "이미지가 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 파일명 랜덤 생성
        String filename = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

        // Firebase Storage에 업로드
        Bucket bucket = StorageClient.getInstance().bucket();
        Blob blob = bucket.create(filename, file.getInputStream(), file.getContentType());

        // 다운로드 URL 만들기
        String imageUrl = "https://firebasestorage.googleapis.com/v0/b/"
                + bucket.getName()
                + "/o/"
                + filename.replace("/", "%2F")
                + "?alt=media";

        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download")
    @Operation(summary = "이미지 다운로드", description = "이미지 URL로 리다이렉트합니다. \n ex) http://localhost:8080/api/images/download?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fweb-kit-69b0d%2Fo%2F5e210eb0-e947-414d-aaed-4af75ad8dbd7-a.png%3Falt%3Dmedia")
    public ResponseEntity<Void> redirectToImage(@RequestParam("url") String imageUrl) {
        return ResponseEntity.status(302).header("Location", imageUrl).build();
    }

}
