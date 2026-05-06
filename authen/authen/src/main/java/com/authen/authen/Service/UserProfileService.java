package com.authen.authen.Service;

import com.authen.authen.dtos.*;
import com.authen.authen.entities.User;

public interface UserProfileService {


    UserProfileDto getProfile(Long userId);

    void updateName(User user, UpdateNameDto dto);
    void updateEmailRequest(User user, UpdateEmailDto dto);
    void verifyNewEmail(User user, String otp);
    void updatePassword(User user, UpdatePasswordDto dto);

    UserHomeDto getUserHome(Long userId);
}
