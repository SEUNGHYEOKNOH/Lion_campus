package com.kbsw.campus_hackthon.oauth2;

import com.kbsw.campus_hackthon.common.Role;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collection;
import java.util.Map;

@Getter
public class CustomOAuth2User extends DefaultOAuth2User {
    private String email;
    private Role role;

    public CustomOAuth2User(Collection<? extends GrantedAuthority> authorities,
                            Map<String, Object> attribute, String nameAttributeKey,
                            String email, Role role) {
        super(authorities, attribute, nameAttributeKey);
        this.email = email;
        this.role = role;
    }
}
