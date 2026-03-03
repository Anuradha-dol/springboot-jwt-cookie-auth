package com.authen.authen.Controllers;

import com.authen.authen.Service.UserProfileService;
import com.authen.authen.dtos.UserHomeDto;
import com.authen.authen.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')") // Only ADMIN can access any endpoint here
@RequiredArgsConstructor
public class AdminController {

    private final UserProfileService userProfileService;

    @GetMapping("/dashboard")
    public ResponseEntity<UserHomeDto> getAdminHome(@AuthenticationPrincipal User loggedUser) {
        // loggedUser is automatically injected by Spring Security
        return ResponseEntity.ok(userProfileService.getUserHome(loggedUser.getUserId()));
    }
}

