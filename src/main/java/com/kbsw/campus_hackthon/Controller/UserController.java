package com.kbsw.campus_hackthon.Controller;


import com.kbsw.campus_hackthon.Repository.TagRepository;
import com.kbsw.campus_hackthon.entity.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/user"})
public class UserController {
    private final TagRepository tagRepository;

    @GetMapping({"/tags/{userId}"})
    public ResponseEntity<List<Tag>> getUserTags(@PathVariable Long userId) {
        List<Tag> tags = this.tagRepository.findByUserProfileId(userId);
        return ResponseEntity.ok(tags);
    }

    public UserController(final TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }
}
