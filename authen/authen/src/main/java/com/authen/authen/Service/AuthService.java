package com.authen.authen.service;

import com.authen.authen.dtos.AuthResponse;
import com.authen.authen.records.AuthRecords;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {


    AuthResponse signUp(AuthRecords.RegisterRequest registerRequest);

    AuthResponse SignIn(AuthRecords.LoginRequest loginRequest, HttpServletResponse response);

    AuthResponse verifyCode(String email, String verifyCode);


    AuthResponse resendOtp(String email);


}

