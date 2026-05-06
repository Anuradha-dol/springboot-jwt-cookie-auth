package com.authen.authen.records;

import com.authen.authen.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public final class AuthRecords {

    private AuthRecords() {
    }

    public record ChangePassword(String password, String repeatPassword) {
    }

    public record LoginRequest(
            @Email(message = "please provide valid email")
            String email,
            @NotBlank(message = "password is required ")
            String password
    ) {
    }

    public record MailBody(String to, String subject, String text) {
    }

    public record RegisterRequest(
            @NotBlank(message = "name is required")
            String name,
            @NotBlank(message = "last name required")
            String lastName,
            @NotBlank(message = "email is required")
            @Email(message = "please provide valid email! ")
            String email,
            String tempEmail,
            @NotBlank(message = "phonenumber is required")
            String phoneNumber,
            Role role,
            @NotBlank(message = "password is required")
            String password
    ) {
    }

    public record VerifyCodeDto(
            @NotBlank(message = "Verification code is required")
            String verifyCode
    ) {
    }
}
