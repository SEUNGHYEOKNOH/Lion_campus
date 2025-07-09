package com.kbsw.campus_hackthon.util;

//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private static final String BASE64_SECRET = "wA9sX2r4P6kZ58Xt+ZK1F/8tZ2YBd/WFT3WMSvTRVKg=";
    private final Key key;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtUtil() {
        this.key = Keys.hmacShaKeyFor((byte[])Decoders.BASE64.decode("wA9sX2r4P6kZ58Xt+ZK1F/8tZ2YBd/WFT3WMSvTRVKg="));
        this.accessTokenExpiration = 7200000L;
        this.refreshTokenExpiration = 1209600000L;
    }

    public String generateAccessToken(String email) {
        Date now = new Date();
        return Jwts.builder().setSubject(email).setIssuedAt(now).setExpiration(new Date(now.getTime() + 7200000L)).signWith(this.key, SignatureAlgorithm.HS256).compact();
    }

    public String generateRefreshToken(String email) {
        Date now = new Date();
        return Jwts.builder().setSubject(email).setIssuedAt(now).setExpiration(new Date(now.getTime() + 1209600000L)).signWith(this.key, SignatureAlgorithm.HS256).compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(this.key).build().parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException | SecurityException var3) {
            System.out.println("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException var4) {
            System.out.println("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException var5) {
            System.out.println("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException var6) {
            System.out.println("JWT 클레임이 비어 있습니다.");
        }

        return false;
    }

    public String getEmailFromToken(String token) {
        return this.parseClaims(token).getSubject();
    }

    public Date getExpiration(String token) {
        return this.parseClaims(token).getExpiration();
    }

    private Claims parseClaims(String token) {
        return (Claims)Jwts.parserBuilder().setSigningKey(this.key).build().parseClaimsJws(token).getBody();
    }
}
