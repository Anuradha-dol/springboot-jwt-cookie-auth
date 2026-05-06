package com.authen.authen.dtos;

import com.authen.authen.enums.Role;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public final class AuthResponse {

    private String name;
    private String lastName;
    private String email;

    private String phoneNumber;
    private String accessToken;
    private String refreshToken;
    private String tempEmail;
    private boolean isVerified;
    private Role role;
    private boolean success;  // <-- primitive boolean
    private String message;
    private String token;
}
