package com.authen.authen.Service;

import com.authen.authen.dtos.*;
import com.authen.authen.entities.ForgotPassword;
import com.authen.authen.entities.User;
import com.authen.authen.repos.ForgotPasswordRepository;
import com.authen.authen.repos.UserRepo;
import com.authen.authen.utils.EmailUtils;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserProfileServiceimpl implements UserProfileService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final ForgotPasswordRepository forgotPasswordRepository;
    private final EmailUtils emailUtils;

    @Transactional
    public void deleteAccount(User user, DeleteAccountDto dto) {

        // Verify current password
        if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Hard delete: remove row from DB
        userRepo.delete(user);
    }


    @Transactional
    public void requestDeletion(User user) {
        // Generate OTP
        int otp = new Random().nextInt(900000) + 100000;
        Date expirationTime = new Date(System.currentTimeMillis() + 10 * 60 * 1000); // 10 min

        ForgotPassword fp = forgotPasswordRepository.findByUser(user)
                .orElse(new ForgotPassword());

        fp.setOtp(otp);
        fp.setExpirationTime(expirationTime);
        fp.setUser(user);

        forgotPasswordRepository.save(fp);

        // Send OTP to the logged-in user's email
        try {
            emailUtils.sendMail(
                    new MailBody(
                            user.getEmail(),
                            "OTP for Account Deletion",
                            "Your OTP to delete your account is: " + otp + " (valid for 10 minutes)"
                    )
            );
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP");
        }
    }


    @Transactional
    public void verifyAndDelete(User user, DeleteAccountForgotVerifyDto dto) {
        ForgotPassword fp = forgotPasswordRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("OTP not requested"));

        // Check OTP
        if (!fp.getOtp().equals(Integer.parseInt(dto.otp()))) {
            throw new RuntimeException("Invalid OTP");
        }

        // Check expiration
        if (fp.getExpirationTime().before(new Date())) {
            throw new RuntimeException("OTP expired");
        }

        // Hard delete
        userRepo.delete(user);

        // Remove OTP record
        forgotPasswordRepository.delete(fp);
    }



    // Update Name
    @Transactional
    public void updateName(User user, UpdateNameDto dto) {
        user.setName(dto.name());
        user.setLastName(dto.lastName());
        userRepo.save(user);
    }


    @Transactional
    public void updateEmailRequest(User user, UpdateEmailDto dto) {
        String newEmail = dto.newEmail();

        if (userRepo.findByEmail(newEmail).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        // Save new email temporarily
        user.setTempEmail(newEmail);

        // Generate OTP
        int otp = (int) (Math.random() * 900_000) + 100_000;
        user.setVerifyCode(String.valueOf(otp));
        user.setVerifyCodeExpiry(new Date(System.currentTimeMillis() + 5 * 60 * 1000)); // 5 min
        user.setLastOtpSentAt(new Date());

        userRepo.save(user);

        // Send OTP to new email
        try {
            MailBody mailBody = new MailBody(
                    newEmail,
                    "Verify new email",
                    "Your OTP for updating email is: " + otp + " (valid for 5 min)"
            );
            emailUtils.sendMail(mailBody);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP");
        }
    }


    @Transactional
    public void verifyNewEmail(User user, String otp) {
        if (!user.getVerifyCode().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getVerifyCodeExpiry().before(new Date())) {
            throw new RuntimeException("OTP expired");
        }

        // ✅ Update actual email
        user.setEmail(user.getTempEmail());
        user.setTempEmail(null);
        user.setVerifyCode(null);
        user.setVerifyCodeExpiry(null);

        userRepo.save(user);
    }


    // Update Password
    @Transactional
    public void updatePassword(User user, UpdatePasswordDto dto) {
        if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (!dto.newPassword().equals(dto.confirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepo.save(user);
    }





    @Override
    public UserHomeDto getUserHome(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Example dashboard data
        return new UserHomeDto(
                "Welcome back, " + user.getName() + "!",
                3, // notifications
                5  // tasks
        );
    }
    @Override
    public UserProfileDto getProfile(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserProfileDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getLastName(),
                user.getRole().name() // Pass all roles
        );
    }















}
