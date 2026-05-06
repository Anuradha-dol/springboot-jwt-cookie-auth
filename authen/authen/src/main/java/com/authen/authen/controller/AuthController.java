package com.authen.authen.controller;

import com.authen.authen.dtos.AuthResponse;
import com.authen.authen.records.AuthRecords;
import com.authen.authen.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRecords.RegisterRequest registerRequest,
                                                 HttpServletResponse response) {
        AuthResponse res = authService.signUp(registerRequest);

        // ✅ store email in cookie for resend OTP convenience
        Cookie emailCookie = new Cookie("userEmail", registerRequest.email());
        emailCookie.setHttpOnly(true);
        emailCookie.setPath("/");
        emailCookie.setMaxAge(30 * 60); // 30 minutes
        emailCookie.setSecure(false); // true if using https
        emailCookie.setDomain("localhost"); // match frontend domain

        response.addCookie(emailCookie);

        return ResponseEntity.ok(res);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRecords.LoginRequest loginRequest,
                                              HttpServletResponse response) {
        return ResponseEntity.ok(authService.SignIn(loginRequest, response));
    }

    // ================= VERIFY OTP =================
    @PostMapping("/verify-code")
    public ResponseEntity<AuthResponse> verifyCode(@Valid @RequestBody AuthRecords.VerifyCodeDto verifyCodeDto, HttpServletRequest request) {

        // get email from cookie
        String email = null;
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("userEmail".equals(c.getName())) {
                    email = c.getValue();
                    break;
                }
            }
        }

        if (email == null) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .message("Email not found. Please start the process again.")
                            .success(false)
                            .build());
        }
        String verifyCode = verifyCodeDto.verifyCode();

        return ResponseEntity.ok(authService.verifyCode(email, verifyCode));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOtp(HttpServletRequest request) {

        // get email from cookie
        String email = null;
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("userEmail".equals(c.getName())) {
                    email = c.getValue();
                    break;
                }
            }
        }

        if (email == null) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .message("Email not found. Please start the process again.")
                            .success(false)
                            .build());
        }

        // call service method with resend limit logic
        return ResponseEntity.ok(authService.resendOtp(email));
    }





}
