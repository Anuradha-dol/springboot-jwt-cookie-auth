package com.authen.authen.Service;

import com.authen.authen.dtos.*;
import com.authen.authen.entities.User;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

public interface AuthService {


    AuthResponse signUp(RegisterRequest registerRequest);

    AuthResponse SignIn(LoginRequest loginRequest, HttpServletResponse response);

    AuthResponse verifyCode(String email, String verifyCode);


    AuthResponse resendOtp(String email);


}

