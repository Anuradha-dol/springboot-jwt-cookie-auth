package com.authen.authen.records;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class UserRecords {

    private UserRecords() {
    }

    public record DeleteAccountDto(
            @NotBlank(message = "Current password is required")
            String currentPassword
    ) {
    }

    public record DeleteAccountForgotRequest(
            @NotBlank(message = "Email is required")
            String email
    ) {
    }

    public record DeleteAccountForgotVerifyDto(
            @NotBlank(message = "OTP is required")
            String otp
    ) {
    }

    public record UpdateEmailDto(
            @NotBlank(message = "Email cannot be blank")
            @Email(message = "Provide a valid email")
            String newEmail
    ) {
    }

    public record UpdateNameDto(
            @NotBlank(message = "Name cannot be blank")
            String name,
            String lastName
    ) {
    }

    public record UpdatePasswordDto(
            @NotBlank(message = "Current password is required")
            String currentPassword,
            @NotBlank(message = "New password is required")
            @Size(min = 6, message = "Password must be at least 6 characters")
            String newPassword,
            @NotBlank(message = "Confirm password is required")
            String confirmPassword
    ) {
    }

    public record UserHomeDto(String welcomeMessage, int notifications, int tasks) {
    }

    public record UserProfileDto(
            Long id,
            String name,
            String email,
            String lastName,
            String phoneNumber,
            String role,
            String profilePhotoUrl,
            String coverPhotoUrl
    ) {
    }

    public record PhotoPayload(byte[] data, String contentType) {
    }
}
