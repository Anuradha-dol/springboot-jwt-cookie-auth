package com.authen.authen.service;

import com.authen.authen.entity.User;
import com.authen.authen.records.UserRecords;
import org.springframework.web.multipart.MultipartFile;

public interface UserProfileService {


    UserRecords.UserProfileDto getProfile(Long userId);

    void updateName(User user, UserRecords.UpdateNameDto dto);
    void updateEmailRequest(User user, UserRecords.UpdateEmailDto dto);
    void verifyNewEmail(User user, String otp);
    void updatePassword(User user, UserRecords.UpdatePasswordDto dto);

    UserRecords.UserHomeDto getUserHome(Long userId);

    void deleteAccount(User user, UserRecords.DeleteAccountDto dto);

    void requestDeletion(User user);

    void verifyAndDelete(User user, UserRecords.DeleteAccountForgotVerifyDto dto);

    UserRecords.UserProfileDto uploadProfilePhoto(User user, MultipartFile file);

    UserRecords.UserProfileDto uploadCoverPhoto(User user, MultipartFile file);

    UserRecords.PhotoPayload getProfilePhoto(User user);

    UserRecords.PhotoPayload getCoverPhoto(User user);
}
