package com.authen.authen.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerifyCodeDto(


        @NotBlank(message = "Verification code is required")
        String verifyCode
) {}
