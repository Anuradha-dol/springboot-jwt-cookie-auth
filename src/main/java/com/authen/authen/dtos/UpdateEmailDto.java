package com.authen.authen.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateEmailDto(
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Provide a valid email")
        String newEmail
) {}
