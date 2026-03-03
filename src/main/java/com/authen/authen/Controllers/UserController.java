package com.authen.authen.Controllers;

import com.authen.authen.Service.UserProfileService;
import com.authen.authen.Service.UserProfileServiceimpl;
import com.authen.authen.Service.AuthService;
import com.authen.authen.dtos.*;
import com.authen.authen.entities.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final UserProfileServiceimpl userService;
    private  final UserProfileService userProfileService;




    // Update name
    @PutMapping("/update-name")
    public ResponseEntity<String> updateName(
            @AuthenticationPrincipal User loggedUser,
            @Valid @RequestBody UpdateNameDto dto) {
        userProfileService.updateName(loggedUser, dto);
        return ResponseEntity.ok("Name updated successfully");
    }

    // Update email (send OTP)
    @PutMapping("/update-email")
    public ResponseEntity<String> updateEmail(
            @AuthenticationPrincipal User loggedUser,
            @Valid @RequestBody UpdateEmailDto dto) {
        userProfileService.updateEmailRequest(loggedUser, dto);
        return ResponseEntity.ok("OTP sent to new email for verification");
    }

    // Verify new email
    @PostMapping("/verify-new-email")
    public ResponseEntity<String> verifyNewEmail(
            @AuthenticationPrincipal User loggedUser,
            @RequestParam String otp) {
        userProfileService.verifyNewEmail(loggedUser, otp);
        return ResponseEntity.ok("Email updated successfully");
    }

    // Update password
    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(
            @AuthenticationPrincipal User loggedUser,
            @Valid @RequestBody UpdatePasswordDto dto) {
        userProfileService.updatePassword(loggedUser, dto);
        return ResponseEntity.ok("Password updated successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal User loggedUser) {
        return ResponseEntity.ok(userProfileService.getProfile(loggedUser.getUserId()));
    }

    @PreAuthorize("hasRole('USER')") // Only normal users
    @GetMapping("/home")
    public ResponseEntity<UserHomeDto> getHome(@AuthenticationPrincipal User loggedUser) {
        return ResponseEntity.ok(userProfileService.getUserHome(loggedUser.getUserId()));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAccount(
            @AuthenticationPrincipal User loggedUser,
            @Valid @RequestBody DeleteAccountDto dto) {


        userService.deleteAccount(loggedUser, dto);
        return ResponseEntity.ok("Account deleted successfully (soft delete)");
    }




    @PostMapping("/delete-forgot-request")
    public ResponseEntity<String> deleteForgotRequest(@AuthenticationPrincipal User loggedUser) {
        userService.requestDeletion(loggedUser);
        return ResponseEntity.ok("OTP sent to your registered email. Verify to delete your account.");
    }


    @PostMapping("/delete-forgot-verify")
    public ResponseEntity<String> deleteForgotVerify(
            @AuthenticationPrincipal User loggedUser,
            @Valid @RequestBody DeleteAccountForgotVerifyDto dto) {

        userService.verifyAndDelete(loggedUser, dto);
        return ResponseEntity.ok("Account deleted successfully (hard delete).");
    }



}

