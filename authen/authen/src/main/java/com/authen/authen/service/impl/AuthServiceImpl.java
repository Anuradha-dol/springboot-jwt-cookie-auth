package com.authen.authen.service.impl;

import com.authen.authen.dtos.AuthResponse;
import com.authen.authen.entity.User;
import com.authen.authen.enums.Role;
import com.authen.authen.enums.Token;
import com.authen.authen.records.AuthRecords;
import com.authen.authen.repository.UserRepo;
import com.authen.authen.service.AuthService;

import com.authen.authen.util.EmailUtils;
import com.authen.authen.util.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailUtils emailUtils;
    private  final AuthenticationManager authenticationManager;
    private final  JwtUtils jwtUtils;

    @Override
    public AuthResponse signUp(AuthRecords.RegisterRequest registerRequest) {
        String normalizedTempEmail = (registerRequest.tempEmail() == null || registerRequest.tempEmail().isBlank())
                ? null
                : registerRequest.tempEmail();

        // 1️⃣ Check if a user with this email already exists
        Optional<User> optionalUser = userRepo.findByEmail(registerRequest.email());
        User user;

        if (optionalUser.isPresent()) {
            user = optionalUser.get();

            // Block if already verified or verification code still valid
            if (user.getIsVerified() || (user.getVerifyCodeExpiry() != null && user.getVerifyCodeExpiry().after(new Date()))) {
                return AuthResponse.builder()
                        .message("Email already exists!")
                        .success(false)
                        .build();
            }

            // Reuse unverified user
            user.setName(registerRequest.name());
            user.setLastName(registerRequest.lastName());
            user.setPassword(passwordEncoder.encode(registerRequest.password()));
            user.setPhoneNumber(registerRequest.phoneNumber());
            user.setTempEmail(normalizedTempEmail);
            user.setRole(
                    registerRequest.role() != null
                            ? registerRequest.role()
                            : Role.ROLE_USER
            );

            user.setIsVerified(false);

        } else {
            // 2️⃣ Create new user
            user = new User();
            user.setName(registerRequest.name());
            user.setLastName(registerRequest.lastName());
            user.setEmail(registerRequest.email());
            user.setPassword(passwordEncoder.encode(registerRequest.password()));
            user.setPhoneNumber(registerRequest.phoneNumber());
            user.setTempEmail(normalizedTempEmail);
            user.setRole(
                    registerRequest.role() != null
                            ? registerRequest.role()
                            : Role.ROLE_USER
            );
            user.setIsVerified(false);
        }

        // 3️⃣ Validate phone number uniqueness
        if (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) {
            throw new RuntimeException("Phone number is required");
        }
        Optional<User> phoneExists = userRepo.findByPhoneNumber(user.getPhoneNumber());
        if (phoneExists.isPresent() && !phoneExists.get().getEmail().equals(user.getEmail())) {
            throw new RuntimeException("Phone number already registered");
        }

        // 4️⃣ Generate 6-digit verification code
        int verificationCode = (int) (Math.random() * 900_000) + 100_000;
        user.setVerifyCode(String.valueOf(verificationCode));
        user.setVerifyCodeExpiry(new Date(System.currentTimeMillis() + 2 * 60 * 1000)); // 2 min expiry
        user.setLastOtpSentAt(new Date());

        // 5️⃣ Save user to DB
        User savedUser = userRepo.save(user);

        // 6️⃣ Prepare verification email
        final String subject = "Verify your account";
        final String EMAIL_TEMPLATE = """
        <html>
            <body>
                <h1>Welcome, %s!</h1>
                <p>You have successfully registered to our application.</p>
                <p>Verification code is <b>%s</b>.</p>
                <p>Please click the link to verify your account:</p>
                <a href="http://localhost:5173/verify?email=%s&code=%s">Verify Email</a>
                <p>This link will expire in 2 minutes.</p>
            </body>
        </html>
        """.formatted(savedUser.getName(), savedUser.getVerifyCode(), savedUser.getEmail(), savedUser.getVerifyCode());

        // 7️⃣ Send email
        try {
            AuthRecords.MailBody mailBody = new AuthRecords.MailBody(savedUser.getEmail(), subject, EMAIL_TEMPLATE);
            emailUtils.sendMail(mailBody);
        } catch (Exception e) {
            return AuthResponse.builder()
                    .message("Failed to send verification email. Check SMTP configuration.")
                    .success(false)
                    .build();
        }

        // 8️⃣ Return response
        return AuthResponse.builder()
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .tempEmail(savedUser.getTempEmail())
                .message("User registered successfully! Verification email sent.")
                .success(true)
                .build();
    }


    @Override
    public AuthResponse SignIn(AuthRecords.LoginRequest loginRequest, HttpServletResponse response) {
        Optional<User> optionalUser = userRepo.findByEmail(loginRequest.email());
        if (optionalUser.isEmpty()) {
            return AuthResponse.builder()
                    .message("Invalid email or password!")
                    .success(false)
                    .build();
        }

        User user = optionalUser.get();

        if (!user.getIsVerified()) {
            return AuthResponse.builder()
                    .message("Email not verified! Please verify first.")
                    .success(false)
                    .build();
        }

        if (user.getRole() == null) {
            user.setRole(Role.ROLE_USER);
            user = userRepo.save(user);
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
            );
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return AuthResponse.builder()
                    .message("Invalid email or password!")
                    .success(false)
                    .build();
        } catch (org.springframework.security.authentication.DisabledException e) {
            return AuthResponse.builder()
                    .message("User account is disabled!")
                    .success(false)
                    .build();
        } catch (RuntimeException e) {
            return AuthResponse.builder()
                    .message("Unable to process login right now. Please try again.")
                    .success(false)
                    .build();
        }


        // Generate tokens
            Map<String, Object> claims = new HashMap<>();
            claims.put("name", user.getName());
            claims.put("email", user.getEmail());

            String accessToken = jwtUtils.generateToken(claims, user, response, Token.ACCESS);
            String refreshToken = jwtUtils.generateToken(claims, user, response, Token.REFRESH);

            // You just set cookies in JwtUtils, but saved refresh token in DB
            user.setRefreshToken(refreshToken);
            User savedUser = userRepo.save(user);

            return AuthResponse.builder()
                    .name(savedUser.getName())
                    .lastName(savedUser.getLastName())// ✅ safer to use savedUser
                    .email(savedUser.getEmail())
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .isVerified(Boolean.TRUE)
                    .role(savedUser.getRole()) // pass the Set<Role>

                    .success(Boolean.TRUE)
                    .message("Login successful!")
                    .build();


        }



    @Override
    public AuthResponse verifyCode(String email, String verifyCode) {
        Optional<User> optionalUser = userRepo.findByEmail(email);

        User user;
        if (optionalUser.isEmpty()) {
            return AuthResponse.builder()
                    .message("User not found!")
                    .success(false)
                    .build();
        }

         user = optionalUser.get();

        if (user.getIsVerified()) {
            return AuthResponse.builder()
                    .message("User already verified!")
                    .success(false)
                    .build();
        }

        if (!user.getVerifyCode().equals(verifyCode)) {
            return AuthResponse.builder()
                    .message("Invalid verification code!")
                    .success(false)
                    .build();
        }



        if (user.getVerifyCodeExpiry().before(new Date())) {
            return AuthResponse.builder()
                    .message("Verification code expired! Please request a new one.")
                    .success(false)
                    .build();
        }

        user.setIsVerified(true);
        user.setVerifyCode(null); // remove code after verification
        user.setVerifyCodeExpiry(null);
        userRepo.save(user);

        return AuthResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .message("User verified successfully!")
                .success(true)
                .build();
    }

    @Override
    public AuthResponse resendOtp(String email) {

        Optional<User> optionalUser = userRepo.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return AuthResponse.builder()
                    .message("User not found!")
                    .success(false)
                    .build();
        }

        User user = optionalUser.get();

        if (user.getIsVerified()) {
            return AuthResponse.builder()
                    .message("User already verified!")
                    .success(false)
                    .build();
        }

        Date now = new Date();

        // 1️⃣ Check if user is currently blocked
        if (user.getOtpBlockUntil() != null && now.before(user.getOtpBlockUntil())) {
            long remainingSec = (user.getOtpBlockUntil().getTime() - now.getTime()) / 1000;
            return AuthResponse.builder()
                    .message("Maximum resend attempts reached. Please wait " + remainingSec + " seconds.")
                    .success(false)
                    .build();
        }

        // 2️⃣ Reset window if firstResendTime is null or >1 minute passed
        if (user.getOtpFirstResendTime() == null ||
                now.getTime() - user.getOtpFirstResendTime().getTime() > 60 * 1000) {
            user.setOtpFirstResendTime(now);
            user.setOtpResendCount(0);
        }

        // 3️⃣ Increment resend count
        user.setOtpResendCount(user.getOtpResendCount() == null ? 1 : user.getOtpResendCount() + 1);

        // 4️⃣ If resend count >3 in 1-minute window → block 30 minutes
        if (user.getOtpResendCount() > 3) {
            user.setOtpBlockUntil(new Date(now.getTime() + 30 * 60 * 1000)); // block 30 minutes
            userRepo.save(user);
            return AuthResponse.builder()
                    .message("Maximum resend attempts reached. You are blocked for 30 minutes.")
                    .success(false)
                    .build();
        }

        // 5️⃣ Generate new OTP
        int verificationCode = (int) (Math.random() * 900000) + 100000;
        user.setVerifyCode(String.valueOf(verificationCode));
        user.setVerifyCodeExpiry(new Date(System.currentTimeMillis() + 2 * 60 * 1000));
        user.setLastOtpSentAt(now);

        userRepo.save(user);

        // 6️⃣ Send email
        try {
            AuthRecords.MailBody mailBody = new AuthRecords.MailBody(
                    user.getEmail(),
                    "Resend: Verify your account",
                    "Your verification code is: " + verificationCode + " (valid 2 minutes)"
            );
            emailUtils.sendMail(mailBody);
        } catch (Exception e) {
            return AuthResponse.builder()
                    .message("Failed to send verification email. Check SMTP configuration.")
                    .success(false)
                    .build();
        }

        return AuthResponse.builder()
                .message("Verification code resent successfully! (" + user.getOtpResendCount() + "/3)")
                .success(true)
                .build();
    }







}
