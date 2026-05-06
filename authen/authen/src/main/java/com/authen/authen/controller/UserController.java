package com.authen.authen.controller;

import com.authen.authen.records.UserRecords;
import com.authen.authen.service.UserProfileService;
import com.authen.authen.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService userProfileService;

    // Update name
    @PutMapping("/update-name")
    public ResponseEntity<String> updateName(
            @AuthenticationPrincipal User loggedUser,
            @Valid @RequestBody UserRecords.UpdateNameDto dto) {
        userProfileService.updateName(loggedUser, dto);
        return ResponseEntity.ok("Name updated successfully");
    }

    // Update email (send OTP)
    @PutMapping("/update-email")
    public ResponseEntity<String> updateEmail(
            @AuthenticationPrincipal User loggedUser,
            @Valid @RequestBody UserRecords.UpdateEmailDto dto) {
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
            @Valid @RequestBody UserRecords.UpdatePasswordDto dto) {
        userProfileService.updatePassword(loggedUser, dto);
        return ResponseEntity.ok("Password updated successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<UserRecords.UserProfileDto> getProfile(@AuthenticationPrincipal User loggedUser) {
        return ResponseEntity.ok(userProfileService.getProfile(loggedUser.getUserId()));
    }

    @PostMapping(value = "/me/profile-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserRecords.UserProfileDto> uploadProfilePhoto(
            @AuthenticationPrincipal User loggedUser,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userProfileService.uploadProfilePhoto(loggedUser, file));
    }

    @PostMapping(value = "/me/cover-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserRecords.UserProfileDto> uploadCoverPhoto(
            @AuthenticationPrincipal User loggedUser,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userProfileService.uploadCoverPhoto(loggedUser, file));
    }

    @GetMapping("/me/profile-photo")
    public ResponseEntity<byte[]> getProfilePhoto(@AuthenticationPrincipal User loggedUser) {
        UserRecords.PhotoPayload payload = userProfileService.getProfilePhoto(loggedUser);
        return ResponseEntity.ok()
                .contentType(resolveMediaType(payload.contentType()))
                .body(payload.data());
    }

    @GetMapping("/me/cover-photo")
    public ResponseEntity<byte[]> getCoverPhoto(@AuthenticationPrincipal User loggedUser) {
        UserRecords.PhotoPayload payload = userProfileService.getCoverPhoto(loggedUser);
        return ResponseEntity.ok()
                .contentType(resolveMediaType(payload.contentType()))
                .body(payload.data());
    }

    @PreAuthorize("hasRole('USER')") // Only normal users
    @GetMapping("/home")
    public ResponseEntity<UserRecords.UserHomeDto> getHome(@AuthenticationPrincipal User loggedUser) {
        return ResponseEntity.ok(userProfileService.getUserHome(loggedUser.getUserId()));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAccount(
            @AuthenticationPrincipal User loggedUser,
            @Valid @RequestBody UserRecords.DeleteAccountDto dto) {


        userProfileService.deleteAccount(loggedUser, dto);
        return ResponseEntity.ok("Account deleted successfully (soft delete)");
    }




    @PostMapping("/delete-forgot-request")
    public ResponseEntity<String> deleteForgotRequest(@AuthenticationPrincipal User loggedUser) {
        userProfileService.requestDeletion(loggedUser);
        return ResponseEntity.ok("OTP sent to your registered email. Verify to delete your account.");
    }


    @PostMapping("/delete-forgot-verify")
    public ResponseEntity<String> deleteForgotVerify(
            @AuthenticationPrincipal User loggedUser,
            @Valid @RequestBody UserRecords.DeleteAccountForgotVerifyDto dto) {

        userProfileService.verifyAndDelete(loggedUser, dto);
        return ResponseEntity.ok("Account deleted successfully (hard delete).");
    }

    private MediaType resolveMediaType(String contentType) {
        try {
            return contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM;
        } catch (Exception ignored) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }



}

