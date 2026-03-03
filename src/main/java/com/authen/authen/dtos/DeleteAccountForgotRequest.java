package com.authen.authen.dtos;

import jakarta.validation.constraints.NotBlank;

public record DeleteAccountForgotRequest(
        @NotBlank(message = "Email is required")
        String email
) {}
