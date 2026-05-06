package com.authen.authen.service.impl;

import com.authen.authen.entity.ForgotPassword;
import com.authen.authen.entity.User;
import com.authen.authen.records.AuthRecords;
import com.authen.authen.records.UserRecords;
import com.authen.authen.repository.ForgotPasswordRepository;
import com.authen.authen.repository.UserRepo;
import com.authen.authen.service.UserProfileService;
import com.authen.authen.util.EmailUtils;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Date;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    private static final long MAX_IMAGE_BYTES = 5 * 1024 * 1024;
    private static final String MEDIA_URL_PREFIX = "/media";
    private static final String PROFILE_FOLDER = "profile";
    private static final String COVER_FOLDER = "cover";
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );
    private static final Map<String, String> CONTENT_TYPE_TO_EXTENSION = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp",
            "image/gif", "gif"
    );

    @Value("${app.media.root-dir:uploads}")
    private String mediaRootDir;

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final ForgotPasswordRepository forgotPasswordRepository;
    private final EmailUtils emailUtils;

    @Transactional
    public void deleteAccount(User user, UserRecords.DeleteAccountDto dto) {

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
                    new AuthRecords.MailBody(
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
    public void verifyAndDelete(User user, UserRecords.DeleteAccountForgotVerifyDto dto) {
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
    public void updateName(User user, UserRecords.UpdateNameDto dto) {
        user.setName(dto.name());
        user.setLastName(dto.lastName());
        userRepo.save(user);
    }


    @Transactional
    public void updateEmailRequest(User user, UserRecords.UpdateEmailDto dto) {
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
            AuthRecords.MailBody mailBody = new AuthRecords.MailBody(
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
    public void updatePassword(User user, UserRecords.UpdatePasswordDto dto) {
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
    public UserRecords.UserHomeDto getUserHome(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Example dashboard data
        return new UserRecords.UserHomeDto(
                "Welcome back, " + user.getName() + "!",
                3, // notifications
                5  // tasks
        );
    }
    @Override
    public UserRecords.UserProfileDto getProfile(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserProfileDto(user);
    }

    @Override
    @Transactional
    public UserRecords.UserProfileDto uploadProfilePhoto(User user, MultipartFile file) {
        validateImage(file, "Profile photo");
        User managedUser = getManagedUser(user);
        StoredFile storedFile = storeImage(file, PROFILE_FOLDER, "profile", managedUser.getUserId());
        deleteStoredFile(managedUser.getProfilePhotoPath());
        managedUser.setProfilePhotoPath(storedFile.publicPath());
        managedUser.setProfilePhotoContentType(storedFile.contentType());
        managedUser.setProfilePhoto(null);
        userRepo.save(managedUser);
        return toUserProfileDto(managedUser);
    }

    @Override
    @Transactional
    public UserRecords.UserProfileDto uploadCoverPhoto(User user, MultipartFile file) {
        validateImage(file, "Cover photo");
        User managedUser = getManagedUser(user);
        StoredFile storedFile = storeImage(file, COVER_FOLDER, "cover", managedUser.getUserId());
        deleteStoredFile(managedUser.getCoverPhotoPath());
        managedUser.setCoverPhotoPath(storedFile.publicPath());
        managedUser.setCoverPhotoContentType(storedFile.contentType());
        managedUser.setCoverPhoto(null);
        userRepo.save(managedUser);
        return toUserProfileDto(managedUser);
    }

    @Override
    public UserRecords.PhotoPayload getProfilePhoto(User user) {
        User managedUser = getManagedUser(user);
        if (StringUtils.hasText(managedUser.getProfilePhotoPath())) {
            return readPhotoPayload(
                    managedUser.getProfilePhotoPath(),
                    managedUser.getProfilePhotoContentType(),
                    "Profile photo not found"
            );
        }
        if (managedUser.getProfilePhoto() != null && managedUser.getProfilePhoto().length > 0) {
            return new UserRecords.PhotoPayload(
                    managedUser.getProfilePhoto(),
                    managedUser.getProfilePhotoContentType()
            );
        }
        throw new RuntimeException("Profile photo not found");
    }

    @Override
    public UserRecords.PhotoPayload getCoverPhoto(User user) {
        User managedUser = getManagedUser(user);
        if (StringUtils.hasText(managedUser.getCoverPhotoPath())) {
            return readPhotoPayload(
                    managedUser.getCoverPhotoPath(),
                    managedUser.getCoverPhotoContentType(),
                    "Cover photo not found"
            );
        }
        if (managedUser.getCoverPhoto() != null && managedUser.getCoverPhoto().length > 0) {
            return new UserRecords.PhotoPayload(
                    managedUser.getCoverPhoto(),
                    managedUser.getCoverPhotoContentType()
            );
        }
        throw new RuntimeException("Cover photo not found");
    }

    private User getManagedUser(User user) {
        if (user == null || user.getUserId() == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userRepo.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void validateImage(MultipartFile file, String label) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException(label + " file is required");
        }
        if (file.getSize() > MAX_IMAGE_BYTES) {
            throw new RuntimeException(label + " must be 5MB or smaller");
        }
        String contentType = normalizeContentType(file.getContentType());
        if (!ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new RuntimeException("Only JPG, PNG, WEBP, or GIF images are allowed");
        }
    }

    private UserRecords.UserProfileDto toUserProfileDto(User user) {
        String role = user.getRole() != null ? user.getRole().name() : null;
        String profilePhotoUrl = StringUtils.hasText(user.getProfilePhotoPath())
                ? user.getProfilePhotoPath()
                : (user.getProfilePhoto() != null && user.getProfilePhoto().length > 0 ? "/user/me/profile-photo" : null);
        String coverPhotoUrl = StringUtils.hasText(user.getCoverPhotoPath())
                ? user.getCoverPhotoPath()
                : (user.getCoverPhoto() != null && user.getCoverPhoto().length > 0 ? "/user/me/cover-photo" : null);

        return new UserRecords.UserProfileDto(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getLastName(),
                user.getPhoneNumber(),
                role,
                profilePhotoUrl,
                coverPhotoUrl
        );
    }

    private StoredFile storeImage(MultipartFile file, String folderName, String prefix, Long userId) {
        String contentType = normalizeContentType(file.getContentType());
        String extension = CONTENT_TYPE_TO_EXTENSION.get(contentType);
        String fileName = prefix + "-" + userId + "-" + System.currentTimeMillis() + "-" + UUID.randomUUID() + "." + extension;
        Path mediaRootPath = getMediaRootPath();
        Path folderPath = mediaRootPath.resolve(folderName).normalize();
        Path targetPath = folderPath.resolve(fileName).normalize();

        if (!targetPath.startsWith(mediaRootPath)) {
            throw new RuntimeException("Invalid upload target path");
        }

        try {
            Files.createDirectories(folderPath);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store uploaded image");
        }

        return new StoredFile(MEDIA_URL_PREFIX + "/" + folderName + "/" + fileName, contentType);
    }

    private UserRecords.PhotoPayload readPhotoPayload(String publicPath, String contentType, String notFoundMessage) {
        Path filePath = resolveStoredMediaPath(publicPath);
        if (!Files.exists(filePath)) {
            throw new RuntimeException(notFoundMessage);
        }
        try {
            byte[] data = Files.readAllBytes(filePath);
            String resolvedContentType = StringUtils.hasText(contentType)
                    ? contentType
                    : Files.probeContentType(filePath);
            if (!StringUtils.hasText(resolvedContentType)) {
                resolvedContentType = "application/octet-stream";
            }
            return new UserRecords.PhotoPayload(data, resolvedContentType);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read stored image");
        }
    }

    private void deleteStoredFile(String publicPath) {
        if (!StringUtils.hasText(publicPath)) {
            return;
        }
        try {
            Path filePath = resolveStoredMediaPath(publicPath);
            Files.deleteIfExists(filePath);
        } catch (RuntimeException | IOException ignored) {
            // Keep upload flow resilient even if old file cleanup fails.
        }
    }

    private Path resolveStoredMediaPath(String publicPath) {
        if (!StringUtils.hasText(publicPath)) {
            throw new RuntimeException("Invalid media path");
        }
        String normalizedPublicPath = publicPath.replace("\\", "/");
        String expectedPrefix = MEDIA_URL_PREFIX + "/";
        if (!normalizedPublicPath.startsWith(expectedPrefix)) {
            throw new RuntimeException("Invalid media URL");
        }
        String relativePath = normalizedPublicPath.substring(expectedPrefix.length());
        Path mediaRootPath = getMediaRootPath();
        Path resolvedPath = mediaRootPath.resolve(relativePath).normalize();
        if (!resolvedPath.startsWith(mediaRootPath)) {
            throw new RuntimeException("Invalid media file path");
        }
        return resolvedPath;
    }

    private Path getMediaRootPath() {
        return Paths.get(mediaRootDir).toAbsolutePath().normalize();
    }

    private String normalizeContentType(String contentType) {
        return contentType == null ? "" : contentType.toLowerCase();
    }

    private record StoredFile(String publicPath, String contentType) {
    }

}
