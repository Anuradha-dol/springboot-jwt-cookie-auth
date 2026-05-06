package com.authen.authen.dtos;

import jakarta.validation.constraints.NotBlank;

// Verify OTP to actually delete account
public record DeleteAccountForgotVerifyDto(
        @NotBlank(message = "OTP is required")
        String otp
) {}