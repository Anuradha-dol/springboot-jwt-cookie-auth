package com.authen.authen.entities;


import com.authen.authen.dtos.Role;
import jakarta.persistence.*;
import lombok.*;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Table(name ="users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, length = 500)
    private  String name;

    @Column(nullable = false, length = 500)
    private String lastName;

    @Column(nullable = false, length = 500)
    private  String email;

    // ❌ remove nullable = false
    private String phoneNumber;


    @Column(nullable = false)
    private String password;

    @Column(length = 500)
    private String refreshToken;

    private String verifyCode;

    private Date verifyCodeExpiry;

    private Boolean isVerified=false;

    private Date lastOtpSentAt;
    private Integer otpResendCount;
    private Date otpFirstResendTime;
    private Date otpBlockUntil;

    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private ForgotPassword forgotPassword;

    @Column(unique = false)
    private String tempEmail; // new temporary email


    @Enumerated(EnumType.STRING)
    @Column(nullable = true, length = 500)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }



    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


}
