package com.authen.authen.dtos;

import jakarta.validation.constraints.NotBlank;

// Delete account by confirming current password
public record DeleteAccountDto(
        @NotBlank(message = "Current password is required")
        String currentPassword
) {}

