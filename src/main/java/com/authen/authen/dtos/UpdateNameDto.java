package com.authen.authen.dtos;

import jakarta.validation.constraints.NotBlank;

public record UpdateNameDto(
        @NotBlank(message = "Name cannot be blank")
        String name
        ,String lastName
) {}
