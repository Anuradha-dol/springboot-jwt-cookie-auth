package com.authen.authen.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(@NotBlank(message = "name is required") String name,
                              @NotBlank(message = "last name required") String lastName,
                              @NotBlank(message = "email is required")
                              @Email(message = "please provide valid email! ")
                              String  email,
                              @NotBlank(message = "tempEmail is required")
                              String tempEmail,
                                      @NotBlank(message = "phonenumber is required")
                              String phoneNumber,
                              Role role,


        @NotBlank(message = "password is required") String password) {





}
